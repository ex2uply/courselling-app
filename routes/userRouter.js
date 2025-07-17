const express = require("express");
const z = require("zod");
// const mongoose  = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../db/db");

const saltRounds = 7;
const userRouter = express.Router();

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRETADMIN;

const userMiddleware = require("../middleware/user");



function validData(req, res, next) {
  const validData = z.object({
    email: z.email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
  });

  const parsedData = validData.safeParse(req.body);
  if(!parsedData.success){
    res.status(403).send({
      message: "INVALID FORMAT",
      error: parsedData.error
    })
  }else{
    next();
  }
}

userRouter.post("/signup", validData, async (req, res) => {
  const {email, password, firstName,lastName} = req.body;

  try{
    const hashPassword = await bcrypt.hash(password,saltRounds);
    await UserModel.create({
      email: email,
      password: hashPassword,
      firstName: firstName,
      lastName: lastName
    })
    res.send({
      message: "YOU ARE SIGNED UP."
    });

  }catch(e){
    if(e.code== 11000){
      res.status(400).send({
        message: "EMAIL IN USE."
      })
    }else{
      res.status(400).send({
        message: "SOMETHING WENT WRONG."
      })
    };
  }
});


userRouter.post("/signin",validData,async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;


  const user = await UserModel.findOne({
    email: email
  })
  if(!user){
    res.status(403).send({
      message: "Email id not found. Please Sign Up"
    })
  }
  const verify = await bcrypt.compare(password,user.password);

  if(verify){
    const token = jwt.sign({
      id: user._id
    },JWT_SECRET);
    res.send({
      token: token,
      message: "You are logged in."
    });
  }

  else{
    res.status(403).send({
      message: "Incorrect Password."
    })
  }
});

module.exports = userRouter;