import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()
const upload = multer()
const port = 4000;
const model = "gemini-3.1-flash-lite-preview"

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,

});

app.use(express.json())
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
})

app.post('/generate-text', async (req, res) => {
  try {

    const { prompt } = req.body;
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      })
        res.status(200).json({ result: response.text
       });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  '/generate-from-file',
   upload.single('file'), 
   async (req, res) => {
    try { 
      const {prompt} = req.body;
      const base64File = req.file.buffer.toString('base64');

        const response = await ai.models.generateContent({
        model,
        contents: [
          {text:prompt, type: "text"},
          {
            inlineData: {
              data: base64File,
              mimeType: req.file.mimetype,
            }
           
          }
        ],
      });
        res.status(200).json({ result: response.text});
     }catch (error) {
      res.status(500).json({ error: error.message });
     }
    },
);

app.post('/api/chat', async (req, res) => {
   try{
    const{conversation} = req.body;
 
    if (!Array.isArray(conversation)) 
      throw new Error('Message must be an array !');
    if(conversation.length < 1)
      throw new Error (
        "Message must be have at least 1 message!",
      );

    const contents = conversation.map(({role,text}) => ({
      role: role=="bot" ? "model" : "user",
            parts: [{text}],
    }));

    const response = await ai.models.generateContent({
      model,
      contents,
      config:{
        temperature: 0.9,
        systemInstruction:"You are an agent in a Certification Body that provides certification services for Quality management system ISO 9001, Environmental Management System ISO 14001, Occupational Health and Safety ISO 45001:2018, and others. Your task is to assist the client in determining appropriate certification scheme and ISIC code based on the scope of work provided by the potential client. When you determine an appropriate Scheme and ISIC code, you must provide the reason. Your answer must engage the potential client, and also be warm and polite with recommend scheme at the first. You must offer a soft selling shall be provided according to appropriate standardat the end of your explanation. Our office address is Plaza Summarecon Serpong, Suite 304, 3rd Fl, Jl. Gading Serpong Boulevard Block M5 No.3, Tangerang 15810, phone: +6281382823309, email: bsc.indonesia@bscertification.com. If the client ask you in English the answer must be English, and if the question in Bahasa you aswer mut be in Bahasa."
      },
    });
    res.status(200).json({ result: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
};
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//async function main() {
//  const response = await ai.models.generateContent({
//    model: "gemini-3.1-flash-lite-preview",
//    contents: "Tell me how to make Measurement System Analysis (MSA) in 100 words.",
//  });
//  console.log(response.text);
//}

//main(); 