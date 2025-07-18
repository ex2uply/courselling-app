require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose"); 

const userRouter = require("./routes/userRouter")
const adminRouter = require("./routes/adminRouter");
;

const MONGODBURL = process.env.MONGODBURL;

async function main() {
  await mongoose.connect(MONGODBURL);
  console.log("db connected");
}

main();



const app = express();
app.use(express.json());

app.use("/user",userRouter);
app.use("/admin", adminRouter);

app.listen(3000);