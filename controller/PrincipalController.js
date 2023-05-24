const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Principal = require("../models/Principal");

