const {Router} = require("express");
const adminRouter = Router();
const z = require("zod");
const mongoose  = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {AdminModel} = require('../db/db');
const saltRounds = 7;

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRETADMIN;




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

adminRouter.post("/signup", validData, async (req, res) => {
  const {email, password, firstName,lastName} = req.body;
  try{
    const hashPassword = await bcrypt.hash(password,saltRounds);
    await AdminModel.create({
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


adminRouter.post("/signin",validData,async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;


  const admin = await AdminModel.findOne({
    email: email
  })
  if(!admin){
    res.status(403).send({
      message: "Email id is not signed in."
    })
  }
  const verify = await bcrypt.compare(password,admin.password);

  if(verify){
    const token = jwt.sign({
      id: admin._id
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


adminRouter.post("/course", (req,res)=>{

});

adminRouter.get("/course/bulk",(req,res)=>{

});


module.exports = adminRouter;
  