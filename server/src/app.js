const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running Successfully",
  });
});

module.exports = app;
