const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username : {
        type : String,
        unique: true,
        required: true,
    },
    password : {
        type : String,
        required: true,
        select : false,
    },
    email : {
        type : String,
        required: true,
    },
    courses : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Course",
        }
    ]
},{
    timestamps : true,
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;