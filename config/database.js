const mongoose = require("mongoose");


const database = () => {

mongoose.connect(
    process.env.DB_URL,
)
.then(() => {
    console.log("=============== Connected To DB ==============");
}).catch((err) => {
    console.log("=============== Error Connected To DB ==============");
})
}
module.exports = database;