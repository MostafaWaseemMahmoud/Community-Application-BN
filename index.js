const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const users = [];

const corsOptions = {
  origin: "http://localhost:4200", // Allow requests only from this origin
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

const port = 8080 || process.env.PORT;
