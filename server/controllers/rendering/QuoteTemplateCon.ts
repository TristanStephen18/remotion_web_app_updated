import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "path";
import { updateJsonfile_QuoteData } from "../functions/jsonupdater.ts";
import fs from "fs";
import { convertVideo } from "../../utils/ffmpeg.ts";
import type { Request, Response } from "express";
// import { Result } from "postcss";

export const videoGeneration = async (req: Request, res: Response) => {
  const { quote, author, imageurl, fontsize, fontcolor, fontfamily } = req.body;

  console.log(req.body);

  console.log("📝 Received props:", {
    quote,
    author,
    imageurl,
    fontsize,
    fontcolor,
    fontfamily,
  });

  updateJsonfile_QuoteData(
    quote,
    author,
    imageurl,
    fontfamily,
    fontsize,
    fontcolor
  );

  try {
    const entry = path.join(
      process.cwd(),
      "./server/remotion_templates/TemplateHolder/src/index.ts"
    );
    console.log("📂 Bundling Remotion project from:", entry);

    // Check if entry file exists
    if (!fs.existsSync(entry)) {
      console.error("❌ Entry file not found:", entry);
      return res.status(404).json({ error: "Remotion entry file not found" });
    }

    const bundleLocation = await bundle(entry);
    console.log("📦 Bundle location:", bundleLocation);

    const comps = await getCompositions(bundleLocation);
    console.log(
      "📑 Found compositions:",
      comps.map((c) => c.id)
    );

    const comp = comps.find((c) => c.id === "QuoteComposition");
    if (!comp) {
      console.error("❌ Composition 'QuoteComposition' not found!");
      console.error(
        "Available compositions:",
        comps.map((c) => c.id)
      );
      return res.status(404).json({ error: "Composition not found" });
    }
    const outputDir = path.join(process.cwd(), "server/outputs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = `quote-${Date.now()}.mp4`;
    const outputLocation = path.join(outputDir, outputFile);
    console.log("📹 Output location:", outputLocation);

    await renderMedia({
      serveUrl: bundleLocation,
      composition: comp,
      codec: "h264",
      outputLocation,
    });

    console.log("✅ Render complete!");

    const videoUrl = `http://localhost:3000/videos/${outputFile}`;

    return res.json({
      url: videoUrl,
      filename: outputFile,
    });
  } catch (err: any) {
    console.error("❌ Error rendering Remotion project:", err);

    // Provide more specific error information
    let errorMessage = "Unknown error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return res.status(500).json({
      error: "Render failed",
      message: errorMessage,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export const handleExport = async (req: Request, res: Response) => {
  const { quote, author, imageurl, fontsize, fontcolor, fontfamily, format } =
    req.body;

  console.log("📝 Received props:", {
    quote,
    author,
    imageurl,
    fontsize,
    fontcolor,
    fontfamily,
    format,
  });

  updateJsonfile_QuoteData(
    quote,
    author,
    imageurl,
    fontfamily,
    fontsize,
    fontcolor
  );

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
    const comp = comps.find((c) => c.id === "QuoteComposition");
    if (!comp) {
      return res.status(404).json({ error: "Composition not found" });
    }

    const outputDir = path.join(process.cwd(), "server/outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const baseFile = `quote-${Date.now()}`;
    const mp4File = `${baseFile}.mp4`;
    const mp4Path = path.join(outputDir, mp4File);

    const job = await renderMedia({
      serveUrl: bundleLocation,
      composition: comp,
      codec: "h264",
      outputLocation: mp4Path,
    });

    console.log("✅ Render complete!"+ job);

    let finalFile = mp4File;
    let finalPath = mp4Path;

    if (format === "gif" || format === "webm") {
      // Convert with FFmpeg
      finalPath = await convertVideo(mp4Path, format);
      finalFile = path.basename(finalPath);
      console.log(`✅ Converted to ${format}:`, finalPath);
    }

    const protocol = req.protocol;
    const host = req.get("host"); // e.g. tunnel-name.trycloudflare.com
    const origin = `${protocol}://${host}`;

    console.log(origin)

    const fileUrl = `${origin}/videos/${finalFile}`;

    return res.json({
      job,
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
