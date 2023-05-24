const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PrincipalSchema = new Schema({
    username : {
        type : String,
        unique: true,
        required: true,
    },
    password : {
        type : String,
        required: true,
    }
});

const Principal = mongoose.model("Principal", PrincipalSchema);

module.exports = Principal;





