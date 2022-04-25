const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32,
        unique : true
    }
},{timestamps : true})

// timestamps : It will make sure that whenever we are making a new entry through this schema
// it records the exact time it was created and stores in the DataBase for us.

module.exports = mongoose.model("Category" , categorySchema)


