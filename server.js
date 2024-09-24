require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Router = require("./app/routes/tweets");
const cors = require("cors");
const path = require('path');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.use(cors());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(Router);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error while closing MongoDB connection:', error);
    process.exit(1);
  }
});
