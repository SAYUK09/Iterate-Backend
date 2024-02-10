const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apikey: process.env.OPENAI_API_KEY });

app.get("/", function (req, res) {
  res.send("Hello World");
});

const products = JSON.parse(fs.readFileSync("database/products.json", "utf8"));

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

app.post("/relevant-products", async (req, res) => {
  const inputString = req.body.product_idea;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Please classify the category of this product. You can also classify the product into suitable multiple category",
        },
        { role: "user", content: inputString },
      ],
      max_tokens: 100,
    });

    const category = response.choices[0].message.content;
    const categories = category
      .split(" ")
      .map((cat) => cat.trim().toLowerCase());

    console.log(categories, "category");

    const matchingProducts = products.filter((product) => {
      const productCategories = product.category.map((category) =>
        category.toLowerCase()
      );

      return categories.some((cat) => productCategories.includes(cat));
    });

    if (matchingProducts.length > 0) {
      res.json({ products: matchingProducts, message: "Products Found" });
    } else {
      res.json({
        products: matchingProducts,
        message: "Your idea is unique, no such idea in the database",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log(`Listening on port 5000`));
