const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    title: String,
    description: String,
    content: String,
    date: String,
    student: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Student",
      },
    ],
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: "Instructor",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
