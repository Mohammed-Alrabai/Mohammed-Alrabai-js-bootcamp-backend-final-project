const express = require("express");
const router = express.Router();

const {
  createInstructor,
  getForm,
  loginInstructor,
  loginForm,
  getInstructorById,
  getCreateForm,
  createCourse,
  getAllCourseInstructor,
  mainPage,
  deleteCourse,
  getFormUpdate,
  updateCourseInstructor,
  myCoursesPage,
  logoutInstructor,
  showCourse,
  Profile,
  updateInstructor,
} = require("../controller/InstructorController");
const { singSession, checkLoginSession } = require("../Middleware/Auth");

router.get("/Home", checkLoginSession, mainPage);
router.get("/signup", getForm);
router.post("/signup", createInstructor, singSession);
router.get("/login", loginForm);
router.post("/login", loginInstructor, singSession);
router.get("/createCourse", checkLoginSession, getCreateForm);
router.post("/createCourse", checkLoginSession, createCourse);
router.get("/getinstructor", checkLoginSession, getAllCourseInstructor);
router.get("/deleteCourse/:id", checkLoginSession, deleteCourse);
router.get("/updateCourse/:id", getFormUpdate);
router.post("/updateCourse/:id", checkLoginSession, updateCourseInstructor);
router.get("/myCourses", checkLoginSession, myCoursesPage);
router.get("/logout", checkLoginSession, logoutInstructor);
router.get("/myCourses/:id", checkLoginSession, showCourse);
router.get("/profile", checkLoginSession, Profile);
router.post("/update/:id", checkLoginSession, updateInstructor);

module.exports = router;
