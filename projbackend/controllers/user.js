// this route handles all operations of user
// so we have to require the user model 


const User = require('../models/user') // We threw the user model as "User" so const User
const Order = require('../models/order')


exports.getUserById = (req, res,next , id)=>{
    User.findById(id).exec((err , user) => {
        if(err || !user){
            return res.status(400).json({
                error : "No user was found in DB"
            })
        }
        // make a variable profile in the req and store user in it
        req.profile = user
        next() ;
        

    })
}

// get user by id works with a param . 


exports.getUser = (req, res) => {
    // we have already stored the user in req.profile so we send it as response

   
    req.profile.salt = undefined
    req.profile.encry_password = undefined  
    // we have executed the above statements because we don't want to populate salt and encry_password and send as response.
    // we only want to send other information through getUser

    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined 
    // we have also removed unnecessary information as we don't want to return that to the front-end as well. 

    return res.json(req.profile)
}

exports.updateUser = (req,res) => {
    // the useer info has already got the user info stored in req.profile because we used :userId in request 
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body} ,  // this syntax updates the info sent from front-end in DB. Only the attributes that come in req.body will be updated. We might have sent only 2 attributes to change. 
        {new : true , useFindAndModify : false}, // these parameters have to be stated after updating using findByIdAndUpdate. Read about them
        (err , user)=>{
            // user should contain the new updated user.
            if(err || !user){
                return res.status(400).json({
                    error  : "Updation not successfully"
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            return res.json(user)
        } 
    )
}



exports.userPurchaseList = (req, res) => {
    // we can simply return the purchase array from req.profile
    // but we are looking to learn a different way that involves cross-referencing.
    // We use OrderSchema to get the purchaseList of user. For that we have to require it first.
    Order.find({user: req.profile._id})
    .populate("user" , "_id name")       // understand more abour populate statement. Not clear. 
    .exec((err , order) => {
        console.log(order)
        if(err ){
            return res.json({
                error  : "No order by this user"
            })
        }
        return res.json(order)
        // we will get an array of all orders user had given
    })
}

// we have next here because it is a middleware
exports.pushOrderInPurchaseList = (req, res , next) => {

    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id : product._id ,
            name : product.name  ,
            description : product.description ,
            category : product.category ,
            quantity : product.quantity ,
            amount : req.body.order.amount ,
            transaction_id  : req.body.order.transaction_id
        })
    })
    User.findOneAndUpdate(
        {_id : req.profile._id},
        {$push : {purchases : purchases}} ,  // $push is used because this is an array and we want to pass on info there
                                            // the command will replace the purchases in DB to the purchases we have built
                                            // right now.
        {new : true} , // this means fron DB send us the updated object
        (err , purchases) => {      // we don't have to use exec() here
            if(err){
                return res.status(400).json({
                    message : "Unable to save purchase List"
                })
            }
            next()
        }
    )

    next()
}

/*

We can use this with 3 middlewares isSignedIn , isAuthenticated ,IsAdmin if we want the admin to see all users. 

exports.getAllUsers = (req,res) => {
    User.find().exec((err , userSet)=>{
        if(err , !userSet){
            return res.status(400).json({
                message : "Empty User list"
            })
        }
        req.profile = userSet
        return res.json(req.profile)
    })
}
*/
