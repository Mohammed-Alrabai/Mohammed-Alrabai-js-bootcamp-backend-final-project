const express = require("express");
const router = express.Router();
const {
  createStudent,
  loginStudent,
  getStudentById,
  updateStudent,
  getAllStudent,
  delateStudent,
  getAllCourse,
  registerCourse,
  cancelRegisterCourse,
  getMyCourse,
} = require("../controller/StudentController");
const { singToken, verifyToken, checkLogin } = require("../Middleware/Auth");

router.get("/student", checkLogin, getAllStudent);
router.post("/signup", createStudent, singToken);
router.post("/login", loginStudent, singToken);
router.get("/:id", verifyToken, getStudentById);
router.post("/update/:id", verifyToken, updateStudent);
router.get("/delate/:id", verifyToken, delateStudent);
router.get("/course/show",checkLogin, getAllCourse);
router.get("/course/register/:id", verifyToken, registerCourse);
router.get("/course/cancelRegister/:id", verifyToken, cancelRegisterCourse);
router.get("/course/myCourse", verifyToken, getMyCourse);

module.exports = router;
