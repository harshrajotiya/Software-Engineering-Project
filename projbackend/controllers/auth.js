const User = require('../models/user')
const {check , validationResult} = require('express-validator')

const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signout = (req,res)=>{
    // for signing out we only have to clear the coolie and nothing else.
    res.clearCookie("token") // "token" is the name of the long token u put while logging in. We can keep any name it is just a normal variable.
    return res.json({
        message : "User signedout sucessfully"
    })
}

exports.signup = (req,res) => {
    // console.log("REQ BODY ",req.body)
    // res.json({
    //     message : "Sign up works!"
    // })

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        //status 422 is for errors from database operations. We can also give 400 status
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    } 

    const user = new User(req.body) // here we enter the values that we got from front-end or postman in model to 
    // get a user entry in database. // or we can say we are now creating an entry .

    // user is an instance of User model of mongoose so we can use all the DB methods that mongoose provides us.

    // the below command saves it to DB.
    
        //
   //     user.save()
        //


        // but we cannot stop here , as we want to fire a call back to send a response back, so that front-end can 
        // know whether user was saved successfully or there was an error .
        // in the callback , err is error and user is the object itself that has been saved in DB . 
        
        user.save((err , user) => {
            if(err){
                console.log(err)
                return res.status(400).json({
                    message : "NOT able to save user in DB. "
                    // we use 400 status because 400 is for bad request
                })
            }
            //return res.json(user)   

            // we checked in postman that if we send the whole user object then we s
            // sending the whole user info in schema to front-end and we don't want to do that.
            // so we only send some elements.

            return res.json({
                name : user.name ,
                email : user.email ,
                id : user._id    // node it is (_id) always
            })
            // now we have only send some information and not all about john. 
        })

}

exports.signin = (req , res) => {
    // in sign in controller we have to check 3 things
    // 1st whether user is passing email or password both or not
    // whether the email exists in our DB
    // is the password correct
    // theen we log in the user
    
    
    const {email , password} = req.body // we are extracting only these 2 info that we require from the information that frontend has sent
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            message : errors.array()[0].msg 
        })
    }

    User.findOne( {email} , (err , user)=>{
        if(err || !user){    // write both things sometimes we don't get anything in err 
            // email doesn't exist in our database
            return res.status(400).json({
                error : "User Email does not exist"
            })
        }
        // now we know that user exists in database
        if(!user.autheticate(password)){
            return res.status(401).json({
                error : "Email and password do not match"
            })
        }

        // create token
        // now everything seems good so we signin the user by creating a token , put token into cookies.
        const token = jwt.sign({_id : user._id} , process.env.SECRET)  // we have to use a unqiue and required feature for making a token using the given syntax.
        
        // put token in cookie
        res.cookie("token" , token , {expire : new Date() + 9999})

        //send response to front end
        const {_id , name , email , role} = user
        
        return res.json({
            token  , user : {_id , name , email , role}
        })
        // we send the token as well so that the front-end app stores this token to its local storage.


    })    // finds one match from the database the very first one. 


}


// protected routes
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
}) // this is a middleware but we don't put next() because express.Jwt deos it for us. 

// custom middleware
exports.isAuthenticated = (req, res , next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id ;
    // req.profile is set from front-end or postman. If we have a profile set from front-end is checked in the first one
    // req.auth is set from isSignedIn middleware
    // if checker is true then it is authenticated and user can make changes in his own account.
    if(!checker){
        // 403 status means we aree not allowed to do something. In this case , we failed autheentication so we are not
        // allowed to make changes in our account.
        return res.status(403).json({
            error : "ACCeSS denied"
        })
    }  
    next()
}
exports.isAdmin = (req, res , next) => {
    // profile is sent from front-end and it will contain all necessary information
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "You are not admin , ACCESS DENIED"
        })
    }
    next()
}


