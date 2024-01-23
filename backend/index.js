const express = require("express");

const mainRouter = require("./routes/index");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://deepaksurya642:rgvzoomin@cluster0.qwtcohk.mongodb.net/",
  {
    dbName: 'Paytm',
  }
);

app.use("/app/v1", mainRouter);
app.listen(3000, () => console.log("app running of 3000"));
