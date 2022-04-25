const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        trim : true,
        required : true,
        maxlength : 32
    },
    description : {
        type : String,
        trim : true,
        maxlength: 2000,
        required : true
    },
    price : {
        type : Number,
        maxlength: 32,
        required : true,
        trim : true
    },
    category : {
        type : ObjectId,
        ref : "Category",     // we are taking reference from another schema
        required : true
    },
    stock: {
        type : Number
    },
    sold : {
        type : Number,
        default : 0
    },
    photo : {
        data : Buffer ,    // photos are stored in data which will be buffer.
        contentType : String
    }
},{timestamps : true})


module.exports = mongoose.model("Product" , productSchema)


// buffer is the way of storing images in a databse.
// if we have less images then u do it. as DB won't become too heavy.
// else we store all images in firebase and take a reference from there
// and pull it when required. 


// category and product are child and parent schemas.
// read more about referencing.



