const express = require('express')
const router = express.Router()
const {signout , signup , signin , isSignedIn , isAdmin , isAuthenticated} = require('../controllers/auth') ;
const {check , validationResult} = require('express-validator')

// router.use('/signout' , (req,res)=>{
//     return res.send("user signed out")
// })


// const signout1 = (req,res)=>{
//     return res.send("user signed out")
// }

// we can also send a json response if we want

// below is eexample of json response

// const signout = (req,res) => {
//     return res.json({
//         message : "We have successfully signed out"
//     })
// }

// we put these routes call back functions in controllers file to increase readability of code.



router.get('/signout' , signout)

router.post('/signup' , [
    check("name").isLength({min : 3}).withMessage("Name should be of atleast 3 characters"),
    check("email").isEmail().withMessage("Email is required") ,
    check("password").isLength({min : 3}).withMessage("Password should be of atleast 3 charcters")
] , signup)

router.post('/signin' , [
    // we only care about email and password in our login so we have validation for only these.
    check("email").isEmail().withMessage("Email is required") ,
    check("password").isLength({min : 3}).withMessage("Password should be of atleast 3 charcters")
] , signin)

router.get('/testroute' , isSignedIn , (req,res) => {
    return res.json(req.auth)
})


module.exports = router



