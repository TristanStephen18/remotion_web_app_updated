import express from 'express';
import ViteExpress from 'vite-express';
// import dotenv from "dotenv";
// import dataroutes from "./routes/data.ts";
import airoutes from "./routes/apis/gemini.ts";
import renderingroutes from "./routes/rendering.ts";
import uploadroutes from './routes/uploads.ts';
import elevenlabsroutes from './routes/apis/elevenlabs.ts';
import redditroute from './routes/apis/reddit.ts';
import path from "path";
// import cors from "cors";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// dotenv.config();
// const geminiapi = process.env.GEMINI_API_KEY!;

ViteExpress.config({viteConfigFile: './frontend/vite.config.ts'}); 

// app.use('/data', dataroutes);
app.use('/api', airoutes);
app.use('/generatevideo', renderingroutes);
app.use('/uploadhandler', uploadroutes);
app.use('/sound', elevenlabsroutes);
app.use('/reddit', redditroute);


app.use('/videos', express.static(path.join(process.cwd(), './server/outputs')));
app.use('/images', express.static(path.join(process.cwd(), './server/public/images')));
app.use('/bgimages', express.static(path.join(process.cwd(), './server/public/default_backgroundimages')));
app.use('/soundeffects', express.static(path.join(process.cwd(), './server/public/audios')));
app.use('/defaultvideos', express.static(path.join(process.cwd(), './server/public/videos')));
app.use('/kenburnsimages', express.static(path.join(process.cwd(), './server/public/kenburnsuploads')));
app.use('/fakeconvo', express.static(path.join(process.cwd(), './server/public/audios/fakeconvo')));



app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server! Bitch' });
});

ViteExpress.listen(app, 3000, () => {
  // console.log(__dirname);
  // console.log(geminiapi);
  console.log('Server is running on http://localhost:3000');
});