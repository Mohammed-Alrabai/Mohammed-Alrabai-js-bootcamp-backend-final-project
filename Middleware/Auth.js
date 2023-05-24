const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

exports.singToken = async (req, res, next) => {
  const Student = res.locals.Student;
  const token = await jwt.sign({ Student }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({
    Student: {
      id: Student._id,
      username: Student.username,
      name: Student.name,
      email: Student.email,
    },
    token: token,
  });
};
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    res.locals.decoded = decoded;
    next();
  } catch (err) {
    res.status(401).json({ massage: "Please Login" });
  }
};
exports.checkLogin = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json("Please Login");
  }
  next();
};

exports.verifySession = async (req, res, next) => {
  const id = req.params.id;
  const session = req.session.Instructor;
  if (session._id == id) {
    return res.status(201).json("welcome");
  }
};
exports.checkLoginSession = async (req, res, next) => {
  if (!req.session.Instructor) {
    return res.redirect("/instructor/login");
  } else {
    const session = req.session.Instructor;
    next();
  }
};
exports.singSession = async (req, res, next) => {
  const session = (req.session.Instructor = foundInstructor);
  console.log(session);
  next();
};
