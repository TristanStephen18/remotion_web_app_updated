import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import {
  QuoteDataPropsSchema,
  TextTypingTemplatePhraseSchema,
  TextTypingTemplateSchema,
} from "../../models/gemini_schemas.ts";
import { serverImages } from "../../data/localimages.ts";
import {
  CategoryOptions,
  MoodOptions,
} from "../../data/texttyping_moods_categories.ts";

dotenv.config();

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get("/reddit", async (req, res) => {
  //   const { niche, template } = req.body;
  // console.log(process.env.GEMINI_API_KEY!);
  const prompt = `Can you fetch a random reddit post? And respond only with the url`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.send({ message: result.response.text() });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating content. Please try again." });
  }
});

router.post("/generate-textcontent", async (req, res) => {
  const { prompt } = req.body;

  var newprompt = prompt;
  if (!prompt || prompt === "") {
    newprompt = "Create a simple poem";
  }
  try {
    const result = await model.generateContent(newprompt);
    console.log(result.response.text());
    res.json({ textcontent: result.response.text() });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ textcontent: "Error creating content. Please try again." });
  }
});

router.post("/generate-quote", async (req, res) => {
  const prompt = `Suggest a quote by an author. Respond only with the quote and the author nothing else. They should be separated by a dash. Example: Some Quote - Author. Exactly like that nothing else more, don't put the quote in quotation marks, dont add a line before the name of the author, just the quote and author separated by a dash.`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    const data = result.response.text().split(" - ");
    const quote = data[0];
    const author = data[1].replaceAll("\n", "");
    res.json({ quote: quote, author: author });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating content. Please try again." });
  }
});

router.post("/generate-story", async (req, res) => {
  const { prompt, genres } = req.body;

  let newprompt = "";

  if (prompt && genres) {
    newprompt = `${prompt}. Genres: ${genres}`;
  } else if (prompt && !genres) {
    newprompt = prompt;
  } else if (!prompt && genres) {
    newprompt = `Create a story using the following genres: ${genres}`;
  }

  try {
    const result = await model.generateContent(newprompt);
    const text = result.response.text();
    console.log(text);
    res.json({ story: text });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ textcontent: "Error creating story. Please try again." });
  }
});

router.post("/generate-phrase", async (req, res) => {
  const { category, mood } = req.body;

  // const newprompt = `Generate a phrase using the category ${category} and mood ${mood}. This will be in a template so you have to use '\n' to break the phrase when you think it is better to have it in a new line. The maximum characters per line should be 13, spaces will count as a character. And just the phrase,no addition '', "", ' signs.`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a phrase using the category ${category} and mood ${mood}.Break the lines of the phrases where you want to to make the array of lines. Try not to make each line too long,just make it sufficient and proper like this "Dream big, start small".`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: TextTypingTemplatePhraseSchema,
      },
    });
    const text = result.response.text();
    const data = JSON.parse(text);
    console.log(text);
    res.json({ phrase: data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ textcontent: "Error creating story. Please try again." });
  }
});

router.post("/batch-quotejson-trial", async (req, res) => {
  const { quantity } = req.body;
  console.log("Generating datasets");

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate ${quantity} random quotes from philosophers, actors, teachers, from anyone, with author.`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: QuoteDataPropsSchema,
      },
    });

    const text = result.response.text();
    const data = JSON.parse(text);

    console.log(data);
    res.json({ phrase: data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ textcontent: "Error creating story. Please try again." });
  }
});

router.post("/generate/texttypingdataset", async (req, res) => {
  const { quantity } = req.body;
  console.log("Generating datasets for texttyping template");

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate ${quantity} random short phrases, with mood and category. Break the lines of the phrases where you want to to make the array of lines. Try not to make each line too long,just make it sufficient and proper like this "Dream big, start small". Choose only from this moods ${MoodOptions} and categories ${CategoryOptions}. Use this as your basis for the line breaks in the lines array "lines": [
      "Dream big, start small",
      "but start today"
    ]`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: TextTypingTemplateSchema,
      },
    });

    const text = result.response.text();
    const data = JSON.parse(text);

    console.log(data);
    res.json({ phrase: data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ textcontent: "Error creating story. Please try again." });
  }
});

export default router;
