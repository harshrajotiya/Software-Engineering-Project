const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxlength : 32,
        trim : true,
    },
    lastname : {
        type : String,
        maxlength : 32,
        trim : true
    },
    email : {
        type: String,
        trim : true,
        required : true,
        unique : true
    },
    userinfo : {
        type: String,
        trim : true
    },
    encry_password : {
        type : String,
        required : true
    },
    salt : String,
    role : {
        type : Number,  // higher the number more privileges you are having.
        default : 0
    },
    purchases : {
        type : Array,
        default : []
    }
},{timestamps : true})

userSchema.virtual('password').set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.encry_password = this.securePassword(password)
}).get(function(){
    return this._password
})

// we refer to password as password but in reality encry_password is stored in Database.

// crypto is used to get a hashed representation of the password. using salt as the secret. to store it in DB.

// creating methods
userSchema.methods = {
//these functions are taking plain passwords from the users.
    autheticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password // returns a boolean value . 
    }
,
    securePassword : function(plainpassword){
        //first we check whether something is present in the password or not before going to try and catch block.
        if(!plainpassword){
            return "" ;
        }
        try{
            return crypto.createHmac('sha256' , this.salt).update(plainpassword).digest('hex')
        }
        catch(err){
            return "";
        }
    }
}

module.exports = mongoose.model("User" ,userSchema )
