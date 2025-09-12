import { getCompositions, renderMedia } from "@remotion/renderer";
// import { updateJsonfile_Texttyping } from "../functions/jsonupdater.ts";
import type { Request, Response } from "express";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import path from "path";
import { convertVideo } from "../../utils/ffmpeg.ts";
import { updateJsonfile_NewTexttyping } from "../functions/jsonupdater.ts";

export const handlExport = async (req: Request, res: Response) => {
  const { phrase, backgroundIndex, fontIndex, audioIndex, format } = req.body;

  //   console.log(soundurl);

  updateJsonfile_NewTexttyping(phrase, backgroundIndex, fontIndex, audioIndex);

  // updateJsonfile_QuoteData(
  //   quote,
  //   author,
  //   imageurl,
  //   fontfamily,
  //   fontsize,
  //   fontcolor
  // );

  try {
    const entry = path.join(
      process.cwd(),
      "./server/remotion_templates/TemplateHolder/src/index.ts"
    );

    if (!fs.existsSync(entry)) {
      return res.status(404).json({ error: "Remotion entry file not found" });
    }

    const bundleLocation = await bundle(entry);
    const comps = await getCompositions(bundleLocation);
    const comp = comps.find((c) => c.id === "NewTexTyping");
    if (!comp) {
      return res.status(404).json({ error: "Composition not found" });
    }

    const outputDir = path.join(process.cwd(), "server/outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const baseFile = `newtypingvideo-${Date.now()}`;
    const mp4File = `${baseFile}.mp4`;
    const mp4Path = path.join(outputDir, mp4File);

    // Always render MP4 first (Remotion only outputs mp4/webm/mov directly)
    await renderMedia({
      serveUrl: bundleLocation,
      composition: comp,
      codec: "h264",
      outputLocation: mp4Path,
    });

    console.log("✅ Render complete!");

    let finalFile = mp4File;
    let finalPath = mp4Path;

    if (format === "gif" || format === "webm") {
      // Convert with FFmpeg
      finalPath = await convertVideo(mp4Path, format);
      finalFile = path.basename(finalPath);
      console.log(`✅ Converted to ${format}:`, finalPath);
    }

    const fileUrl = `http://localhost:3000/videos/${finalFile}`;

    return res.json({
      url: fileUrl,
      filename: finalFile,
      format: format || "mp4",
    });
  } catch (err: any) {
    console.error("❌ Error rendering Remotion project:", err);
    return res.status(500).json({
      error: "Render failed",
      message: err instanceof Error ? err.message : "Unknown error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
