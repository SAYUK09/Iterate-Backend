const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(5000, () => console.log(`Listening on port 5000`));
