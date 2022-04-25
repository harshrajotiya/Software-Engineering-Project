const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema


// we can also name it as cart.
// we can also have a boolean value of cash on delivery here if we want.

// the products while inside the cart have different information like how many you are buying , transaction id etc.
// so we have to create a seperate schema for all products.

const ProductCartSchema = new mongoose.Schema({
    product : {
        type : ObjectId,
        ref: "Product"
    },
    name : String,
    count : Number,
    price : Number,

})

const OrderSchema = new mongoose.Schema({
    products : [ProductCartSchema],
    transaction_id : {
        type : Number ,
    },
    amount : {
        type : Number
    },
    address : {type : String},
    status : {
        type : String ,
        default : "Recieved" ,
        enums : ["Cancelled" , "Delivered" , "Shipped" , "Processing" , "Recieved"]
    } ,
    updated : Date,
    user : {
        type : ObjectId,
        ref : "User"
    }
},{timestamps : true})



const Order = mongoose.model("Order" , OrderSchema)
const ProductCart = mongoose.model("ProductCart" , ProductCartSchema)

module.exports = {Order , ProductCart}