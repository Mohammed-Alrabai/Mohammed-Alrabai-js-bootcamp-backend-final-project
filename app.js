// ____________import___________
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const moment = require("moment");
const mime = require("mime");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
  })
);

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.use("/public", express.static("public"));

// Database Connected
const database = require("./config/database");
database();

//Import Router
const CourseRouter = require("./Router/CourseRouter");
const StudentRouter = require("./Router/StudentRouter");
const InstructorRouter = require("./Router/InstructorRouter");
const PrincipalRouter = require("./Router/PrincipalRouter");
const Course = require("./models/Course");

// Router Course
app.use("/api/course", CourseRouter);
// Router Student
app.use("/api/student", StudentRouter);
// Router Instructor
app.use("/instructor", InstructorRouter);
// Router Principal
app.use("/api/principal", PrincipalRouter);

// Home Landing Page
app.get("/", (req, res) => {
  res.render("../views/index.ejs");
});
app.listen(port, () => {
  console.log(`listening on ${port} http://localhost:${port}/`);
});
