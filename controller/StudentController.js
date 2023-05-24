const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Course = require("../models/Course");

exports.createStudent = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    if (!username || !passwordHash || !name || !email) {
      return res.status(401).json({ massage: "This field is required" });
    }
    const newStudent = await Student.create({
      username: username,
      password: passwordHash,
      name: name,
      email: email,
    });
    res.locals.Student = newStudent;
    next();
  } catch (err) {
    if (err.code == 11000) {
      return res.status(401).json({
        err: "The username or email already exists, please try again",
      });
    }
    res.status(401).json({ err: err });
  }
};

exports.loginStudent = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const fundStudent = await Student.findOne({ username }).select("+password");
    if (!fundStudent) {
      return res.status(401).json("Student not found");
    }
    const pass = fundStudent.password;
    const compareToken = await bcrypt.compare(password, pass);
    if (compareToken == true) {
      res.locals.Student = fundStudent;
      next();
    } else {
      res.status(401).json({ message: "Invalid username or password " });
    }
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.getStudentById = async (req, res, next) => {
  const decoded = res.locals.decoded;
  const id = req.params.id;
  if (id == decoded.Student._id) {
    const student = await Student.findById(id);
    res.status(201).json({ Student: student });
  } else {
    res.status(401).json({ massage: "You are not authorized to do so" });
  }
};

exports.updateStudent = async (req, res, next) => {
  const id = req.params.id;
  const decoded = res.locals.decoded;
  const password = req.body.password;
  if (id == decoded.Student._id) {
    const passHash = await bcrypt.hash(password, 10);
    const update = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          username: req.body.username,
          password: passHash,
          name: req.body.name,
          email: req.body.email,
        },
      },
      { new: true }
    );
    res.json({ update: update });
  } else {
    res.status(401).json({ message: "You are not allowed to do that" });
  }
};
exports.getAllStudent = async (req, res, next) => {
  const allStudent = await Student.find();
  try {
    res.json({ result: allStudent.length, allStudent: allStudent });
  } catch (err) {
    res.status(401).json(err);
  }
};
exports.delateStudent = async (req, res, next) => {
  const id = req.params.id;
  const decoded = res.locals.decoded;
  if (decoded.Student._id == id) {
    const delate = await Student.findByIdAndDelete(id);
    if (!delate) {
      return res.status(401).json("Not Found");
    }
    res.status(201).json(delate);
  } else {
    res.status(401).json({ message: "You are not allowed to do that" });
  }
};

exports.getAllCourse = async (req, res, next) => {
  const course = await Course.find();
  console.log(course);
  res.json({ result: course.length, course: course });
};
exports.registerCourse = async (req, res, next) => {
  const CourseId = req.params.id;
  const decoded = res.locals.decoded;
  const studentId = decoded.Student._id;
  try {
    const foundCourse = await Course.findById(CourseId);
    const foundStudent = await Student.findById(studentId);
    if (!foundCourse || !foundStudent) {
      return res.status(401).json("Not Found");
    }
    if (foundCourse.student.includes(foundStudent._id)) {
      return res.status(401).json("You are already enrolled in this course");
    }
    foundCourse.student.push(foundStudent._id);
    foundCourse.save();
    foundStudent.courses.push(foundCourse._id);
    foundStudent.save();
    res.status(201).json(foundCourse);
  } catch (err) {
    console.log(err);
  }
};

exports.cancelRegisterCourse = async (req, res, next) => {
    const CourseId = req.params.id;
    const decoded = res.locals.decoded;
    const studentId = decoded.Student._id;
    try {
      const foundCourse = await Course.findById(CourseId);
      const foundStudent = await Student.findById(studentId);
      if (!foundCourse || !foundStudent) {
        return res.status(401).json("Not Found");
      }
      if (!foundCourse.student.includes(foundStudent._id)) {
        return res.status(401).json("You are not enrolled in this course");
        
      }
      const index = foundCourse.student.indexOf(foundStudent._id);
      foundCourse.student.splice(index, 1);
      foundCourse.save();
      foundStudent.courses.splice(index, 1);
      foundStudent.save();
      res.status(201).json(foundCourse);
    }
    catch (err) {
        res.status(401).json(err);
    }
};

exports.getMyCourse = async (req, res, next) => {
  const decoded = res.locals.decoded;
  const studentId = decoded.Student._id;
  try {
    const foundStudent = await Student.findById(studentId);
    if (!foundStudent) {
      return res.status(401).json("Not Found");
    }
    const foundCourse = await Course.find({ student: studentId });
    res.status(201).json(
        { NumberOfCourse: foundCourse.length, yourCourse: foundCourse });
  } catch (err) {
    res.status(401).json(err);
  }
}
