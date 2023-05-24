const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username : {
        type: String,
        required : true,
        unique: true,
    },
    password : {
        type: String,
        required : true
    },
        courses : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Course",
        }
    ]
},
{
    timestamps : true,
});

const Instructor = mongoose.model("Instructor", InstructorSchema);

module.exports = Instructor;