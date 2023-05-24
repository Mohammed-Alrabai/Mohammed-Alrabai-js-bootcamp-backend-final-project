const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Instructor = require("../models/Instructor");
const Course = require("../models/Course");
const moment = require("moment");
const database = require("../config/database");

exports.mainPage = async (req, res, next) => {
  const session = req.session.Instructor;
  if (!session) {
    return res.redirect("/instructor/login");
  }
  const instructor = await req.session.Instructor;
  const InstructorId = instructor._id;
  const foundInstructor = await Instructor.findById(InstructorId).populate(
    "courses"
  );
  const courses = await Course.find().populate("instructor");
  // res.json({ foundInstructor, courses });

  if (!foundInstructor) {
    return res.redirect("/instructor/login");
  }
  res.render("../views/dashboard.ejs", {
    instructor: foundInstructor,
    courses,
  });
  next();
};
exports.myCoursesPage = async (req, res, next) => {
  const session = req.session.Instructor;
  if (!session) {
    return res.redirect("/instructor/login");
  }
  const instructor = await req.session.Instructor;
  const InstructorId = instructor._id;
  const foundInstructor = await Instructor.findById(InstructorId).populate(
    "courses"
  );
  const courses = await Course.find().populate("instructor");
  res.render("../views/dashMyCourse.ejs", {
    instructor: foundInstructor,
    courses,
  });
};
exports.showCourse = async (req, res, next) => {
  const id = req.params.id;
  const course = await Course.findById(id).populate("instructor");
  const instructor = await course.instructor;
  if (course.instructor._id == req.session.Instructor._id) {
    res.render("../views/showCourse.ejs", {
      course,
      instructor,
    });
  } else {
    return res.send("Not Allowed To Access This Page");
  }
};
exports.Profile = async (req, res, next) => {
  const session = req.session.Instructor;
  if (!session) {
    return res.redirect("/instructor/login");
  }

  const instructor = await req.session.Instructor;
  res.render("../views/dashProfile.ejs", {
    instructor,
  });
};
exports.getForm = async (req, res, next) => {
  res.render("../views/form/signup.ejs");
};
exports.createInstructor = async (req, res, next) => {
  const password = req.body.password;
  const passwordHash = await bcrypt.hash(password, 10);
  const newInstructor = await Instructor.create({
    name: req.body.name,
    username: req.body.username,
    password: passwordHash,
  });
  const session = (req.session.Instructor = newInstructor);
  res.redirect("/instructor/home");
};
exports.loginForm = async (req, res, next) => {
  res.render("../views/form/login.ejs");
};
exports.loginInstructor = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const foundInstructor = await Instructor.findOne({ username })
      .populate("courses")
      .select("+password");
    const comparePassword = await bcrypt.compare(
      password,
      foundInstructor.password
    );
    if (comparePassword == true) {
      const session = (req.session.Instructor = foundInstructor);
      // res.json({ foundInstructor, session });
      res.redirect("/instructor/home");
    } else {
      if (!foundInstructor) {
        return res.send("Username or Password Incorrect");
      }
      res.send("Username or Password Incorrect");
    }
  } catch (error) {
    if (error.code == 11000) {
      return res.send("Username or Password Incorrect");
    }
  }
};
exports.getInstructorById = async (req, res, next) => {
  const id = req.params.id;
  const instructor = await Instructor.findById(id);
  const session = (req.session.Instructor = instructor);
  if (id !== session.id) {
    res.send("err");
  } else {
    res.send("hi");
  }
};
exports.logoutInstructor = async (req, res, next) => {
  req.session.destroy();
  res.redirect("/instructor/login");
};

exports.getCreateForm = async (req, res, next) => {
  const session = req.session.Instructor;
  if (!session) {
    return res.redirect("/instructor/login");
  }
  const instructor = await req.session.Instructor;
  const InstructorId = instructor._id;
  const foundInstructor = await Instructor.findById(InstructorId);
  res.render("../views/dashCreateCourse.ejs", {
    instructor: foundInstructor,
  });
};
exports.createCourse = async (req, res, next) => {
  const session = req.session.Instructor;
  const dateTime = req.body.date || moment().format("YYYY-MM-DD");
  dateTime.toString();
  const newCourse = await Course.create({
    title: req.body.title,
    description: req.body.description,
    date: dateTime,
    content: req.body.content,
    instructor: session._id,
  });
  if (newCourse.dateNow > newCourse.date) {
    return res.send("err");
  }
  const instructor = await Instructor.findById(session._id);
  instructor.courses.push(newCourse._id);
  await instructor.save();
  res.redirect("/instructor/myCourses");
};

exports.getFormUpdate = async (req, res, next) => {
  const id = req.params.id;
  const course = await Course.findById(id);
  const instructor = await course.instructor;

  res.render("../views/dashUpdateCourse.ejs", {
    course,
    instructor,
  });
};
exports.updateCourseInstructor = async (req, res, next) => {
  const id = req.params.id;
  try {
    const instructor = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          content: req.body.content,
          date: req.body.date,
        },
      },
      { new: true }
    );
    res.redirect("/instructor/myCourses");
  } catch (err) {
    res.json({ err: err.massage });
  }
};
exports.deleteCourse = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundCourse = await Course.findByIdAndDelete(id);
    if (foundCourse) {
      res.redirect("/instructor/myCourses");
    }
  } catch (err) {
    res.json({ err: err.massage });
  }
};
exports.getAllCourseInstructor = async (req, res, next) => {
  const id = req.params.id;
  const instructor = await Instructor.findById(id).populate("courses");
  const Course = instructor.courses;
  console.log(Course);
  res.render("../views/showCourse.ejs", { Courses: Course });
};
exports.updateInstructor = async (req, res, next) => {
  const id = req.params.id;
  const password = req.body.password;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          username: req.body.username,
          password: passwordHash,
        },
      },
      { new: true }
    );
    res.redirect("/instructor/home");
  } catch (err) {
    if (err.code == 11000) {
      return res.send("Username already exists");
    }
    res.json({ err: err.massage });
  }
};
exports.getAllCourse = async (req, res, next) => {
  const courses = await Course.find().populate("instructor");
};
