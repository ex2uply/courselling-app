const express = require("express");

const courseRouter = express.Router();


const {userMiddleware} = require("../middleware/user");
const { CourseModel, PurchaseModel } = require("../db/db");


courseRouter.get("/preview",async(req,res)=>{
    const course = await CourseModel.find({});


    res.json({
      course: course
    });
})

courseRouter.use(userMiddleware);



//another middleware req. that checks if the user has purchased in reality
courseRouter.post("/purchase", async (req,res)=>{
    const userId = req.id;
    const courseId = req.body.courseId;

    const course = await  CourseModel.findOne(courseId);

    await PurchaseModel.create({
      courseId: courseId,
      userId: userId
    })

    res.send({
      message: "You have succesfully bought this course."
    });
});


courseRouter.get("/allPurchases",async (req,res)=>{
   const userId  = req.id;

   const courses = await PurchaseModel.find({
      userId: userId
   });

   res.send({
    courses: courses
   });
})
