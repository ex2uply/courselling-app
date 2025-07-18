const {Router, application} = require("express");
const adminRouter = Router();
const z = require("zod");
const mongoose  = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {AdminModel, CourseModel} = require('../db/db');
const saltRounds = 7;

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRETADMIN;

const adminMiddleware = require("../middleware/admin");




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


//router to check valid admin logged in
adminRouter.use(adminMiddleware);

adminRouter.post("/course", async (req,res)=>{

  const adminId = req.id;

  const {Name, description,ImageUrl,Price} = req.body;

  const course = await CourseModel.create({
    Name: Name,
    description: description,
    ImageUrl: ImageUrl,
    Price: Price,
    InstructorId: adminId
  })

  res.send({
    message: "COURSE CREATED.",
    courseId: course._id
  })

});

adminRouter.put("/course",async (req,res)=>{
    const adminId = req.id;
    const courseId  = req.body.courseId;

    const course = await CourseModel.findById(courseId);

    const InstructorId = course.InstructorId;

    if(InstructorId!=adminId) res.send({
      message: "NOT AUTHORIZED TO UPDATE THIS COURSE."
    })

    const {Name, description,ImageUrl,Price} = req.body;

    await course.updateOne({
      Name,
      description,
      ImageUrl,
      Price
    })

    res.send({
      message: "Course updated."
    });

});

adminRouter.get("/course/bulk",async (req,res)=>{

  const adminId = req.id;

  const course = await CourseModel.find({
    InstructorId: adminId
  })

  res.send({
    courses: course
  });
  
});


module.exports = adminRouter;
  