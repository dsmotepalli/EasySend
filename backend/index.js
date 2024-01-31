const express = require("express");

const mainRouter = require("./routes/index");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: "Paytm",
  });
  console.log("connected to ", conn.connection.host);
};
connectDB();

app.use("/app/v1", mainRouter);
app.listen(3000, () => console.log("app running of 3000"));
