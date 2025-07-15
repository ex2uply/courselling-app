const mongoose = require("mongoose");
const { string } = require("zod");
require('dotenv').config();

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;



const userSchema = new Schema({
  userId: ObjectId,
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String,
});

const adminSchema = new Schema({
  userId: ObjectId,
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String,
});


const courseSchema = new Schema({
   courseId: ObjectId,
   InstructorId: ObjectId,
   description: String,
   ImageUrl: String,
   Name: String,
   Price: Number
});

const purchaseSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId
})

const CourseModel = mongoose.model("courses", courseSchema);
const UserModel = mongoose.model("user",userSchema);
const AdminModel = mongoose.model("admin",adminSchema);
const PurchaseModel = mongoose.model("purchases",purchaseSchema);

module.exports = {
  CourseModel: CourseModel,
  PurchaseModel: PurchaseModel,
  UserModel: UserModel,
  AdminModel: AdminModel
}