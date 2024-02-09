const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apikey: process.env.OPENAI_API_KEY });

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/generate-image", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await client.images.generate({
      model: "dall-e-2",
      prompt: `generate an icon for the following Product Idea: ${prompt}`,
      size: "512x512",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    res.json({ image_url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log(`Listening on port 5000`));
