require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose"); 
const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/userRouter")
const adminRouter = require("./routes/adminRouter");
;

const MONGODBURL = process.env.MONGODBURL;

async function main() {
  await mongoose.connect(MONGODBURL);
  console.log("db connected");
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

app.use(limiter);

main();



const app = express();
app.use(express.json());

app.use("/user",userRouter);
app.use("/admin", adminRouter);

app.listen(3000);