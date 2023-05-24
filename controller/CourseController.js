const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Course = require("../models/Course");

exports.createCourse = async (req ,res ,next) => {
    
}
