// src/server.ts
import { Router } from "express";
import { ElevenLabsClient } from "elevenlabs";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import os from "os";
import { Readable } from "stream";
import {
  updatechatsJsonfile,
  updateRedditScriptJson,
  updateStoryTellingScriptJson,
} from "../../controllers/functions/jsonupdater.ts";
import { getAudioDurationInSeconds } from "get-audio-duration";

dotenv.config();
const router = Router();

const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY!,
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

router.post("/test-generate", async (req, res) => {
  console.log(req.body.chats);
  try {
    // Voices provided in body or fallback default pair
    const voices: string[] = req.body.voices || [
      "EXAVITQu4vr4xnSDxMaL",
      "XrExE9yKIg1WjnnlVkGX",
    ];

    const chats: { speaker: string; text: string }[] = req.body.chats || [
      { speaker: "person_1", text: "Hey, have you tried The Green Fork yet?" },
      { speaker: "person_2", text: "Not yet. Is it any good?" },
    ];

    if (!Array.isArray(chats) || chats.length === 0) {
      return res.status(400).json({ error: "No chats provided" });
    }

    // 🔑 Map each unique speaker to a voiceId
    const speakerToVoice: Record<string, string> = {};
    let nextVoiceIndex = 0;

    function getVoiceForSpeaker(speaker: string) {
      if (!speakerToVoice[speaker]) {
        // assign next available voice (cycle if more speakers than voices)
        speakerToVoice[speaker] = voices[nextVoiceIndex % voices.length];
        nextVoiceIndex++;
      }
      return speakerToVoice[speaker];
    }

    const audioBuffers: Buffer[] = [];
    const segments: any[] = [];
    let currentTime = 0;

    // 🔊 Generate TTS for each chat line
    for (let i = 0; i < chats.length; i++) {
      const { text, speaker } = chats[i];
      const voiceId = getVoiceForSpeaker(speaker);

      console.log("🎤 Generating voiceover...", {
        voiceId,
        speaker,
        preview: text.slice(0, 80),
      });

      // Generate audio
      const audioStream = await elevenLabs.generate({
        voice: voiceId,
        model_id: "eleven_multilingual_v2",
        text,
      });

      const buffer = await streamToBuffer(audioStream as Readable);
      audioBuffers.push(buffer);

      // Save temp file to measure duration
      const tmpFile = path.join(
        os.tmpdir(),
        `utterance-${i}-${Date.now()}.mp3`
      );
      fs.writeFileSync(tmpFile, buffer);
      const dur = await getAudioDurationInSeconds(tmpFile);

      // Push segment timing
      segments.push({
        text,
        start_time: currentTime,
        end_time: currentTime + dur,
        speaker: {
          id: speaker,
          name: speaker.replace("_", " "),
        },
      });

      currentTime += dur; // advance timeline
    }

    // 🔊 Stitch final audio
    const finalAudio = Buffer.concat(audioBuffers);

    // 💾 Save audio files
    const audioFileName = "fakeconvo.mp3";
    const serverfilename = `fakeconvo-${Date.now()}.mp3`;

    const savePaths = [
      path.join(
        process.cwd(),
        "server/public/audios/fakeconvo",
        serverfilename
      ),
      path.join(
        process.cwd(),
        "server/remotion_templates/TemplateHolder/public",
        audioFileName
      ),
    ];

    savePaths.forEach((savePath) => {
      fs.mkdirSync(path.dirname(savePath), { recursive: true });
      fs.writeFileSync(savePath, finalAudio);
    });

    const duration = await getAudioDurationInSeconds(savePaths[0]);

    // 📦 Build chats.json
    const chatsjson = {
      language_code: "eng",
      segments,
    };

    res.json({
      language_code: "eng",
      serverfilename: `fakeconvo/${serverfilename}`,
      segments,
      duration: duration + 1, // add small padding
    });

    updatechatsJsonfile(chatsjson);
  } catch (err) {
    console.error("Generation error:", err);
    res
      .status(500)
      .json({ error: "Failed to generate conversation", details: String(err) });
  }
});

router.post("/reddit", async (req, res) => {

  console.log("template updating");
  try {
    const { title, textcontent, voiceid } = req.body;

    if (!title || !textcontent || !voiceid) {
      return res.status(400).json({
        error: "Missing required fields: title, textcontent, voiceid",
      });
    }

    // ✅ Smart combine (only add period if missing)
    const endsWithPunct = /[.!?]$/.test(title.trim());
    const story = endsWithPunct
      ? `${title.trim()} ${textcontent.trim()}`
      : `${title.trim()}. ${textcontent.trim()}`;

    console.log("🎤 Generating single TTS...", {
      title,
      voiceid,
      preview: story.slice(0, 80),
    });

    // 🔊 Generate TTS
    const audioStream = await elevenLabs.generate({
      voice: voiceid,
      model_id: "eleven_multilingual_v2",
      text: story,
    });

    const buffer = await streamToBuffer(audioStream as Readable);

    const serverfilename = `reddit-${Date.now()}.mp3`;
    const audioFileName = "reddit.mp3";

    const savePaths = [
      path.join(process.cwd(), "server/public/audios/reddit", serverfilename),
      path.join(
        process.cwd(),
        "server/remotion_templates/TemplateHolder/public",
        audioFileName
      ),
    ];

    savePaths.forEach((savePath) => {
      fs.mkdirSync(path.dirname(savePath), { recursive: true });
      fs.writeFileSync(savePath, buffer);
    });

    const audioPath = savePaths[0];
    const duration = await getAudioDurationInSeconds(audioPath);

    console.log("📐 Performing forced alignment...");
    const alignment = await elevenLabs.forcedAlignment.create({
      file: fs.createReadStream(audioPath),
      text: story,
    });

    console.log("✅ Alignment received");

    const words = alignment.words.map((w: any) => ({
      word: w.text,
      start: w.start,
      end: w.end,
    }));

    const script = {
      story,
      duration,
      words,
      title,
      text: textcontent,
    };

    updateRedditScriptJson(script);

    const result = {
      script,
      duration,
      serverfilename: `/soundeffects/reddit/${serverfilename}`,
    };

    res.json(result);
  } catch (err) {
    console.error("Single TTS + alignment error:", err);
    res.status(500).json({
      error: "Failed to generate single TTS with alignment",
      details: String(err),
    });
  }
});

router.post("/story", async (req, res) => {

  console.log("template updating");
  try {
    const { content, voiceid } = req.body;

    if (!content || !voiceid) {
      return res.status(400).json({
        error: "Missing required fields: title, textcontent, voiceid",
      });
    }
    console.log("🎤 Generating single TTS...", {
      voiceid,
      preview: content.slice(0, 80),
    });

    // 🔊 Generate TTS
    const audioStream = await elevenLabs.generate({
      voice: voiceid,
      model_id: "eleven_multilingual_v2",
      text: content,
    });

    const buffer = await streamToBuffer(audioStream as Readable);

    const serverfilename = `story-${Date.now()}.mp3`;
    const audioFileName = "story.mp3";

    const savePaths = [
      path.join(process.cwd(), "server/public/audios/story", serverfilename),
      path.join(
        process.cwd(),
        "server/remotion_templates/TemplateHolder/public",
        audioFileName
      ),
    ];

    savePaths.forEach((savePath) => {
      fs.mkdirSync(path.dirname(savePath), { recursive: true });
      fs.writeFileSync(savePath, buffer);
    });

    const audioPath = savePaths[0];
    const duration = await getAudioDurationInSeconds(audioPath);

    console.log("📐 Performing forced alignment...");
    const alignment = await elevenLabs.forcedAlignment.create({
      file: fs.createReadStream(audioPath),
      text: content,
    });

    console.log("✅ Alignment received");

    const words = alignment.words.map((w: any) => ({
      word: w.text,
      start: w.start,
      end: w.end,
    }));

    const script = {
      story: content,
      duration,
      words,
    };

    updateStoryTellingScriptJson(script);

    const result = {
      script,
      duration,
      serverfilename: `/soundeffects/story/${serverfilename}`,
    };

    res.json(result);
  } catch (err) {
    console.error("Single TTS + alignment error:", err);
    res.status(500).json({
      error: "Failed to generate single TTS with alignment",
      details: String(err),
    });
  }
});

export default router;
