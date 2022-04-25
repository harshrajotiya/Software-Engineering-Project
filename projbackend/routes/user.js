const router = require('express').Router()

// we want some functions from both auth and user controller
const {getUserById , getUser  , updateUser , userPurchaseList} = require('../controllers/user')
const {isAdmin , isAuthenticated , isSignedIn} = require('../controllers/auth')


router.param("userId" , getUserById)
router.get('/user/:userId' ,isSignedIn , isAuthenticated , getUser)
// when the above statement starts running , it first uses the userId in the above statement to populate req.profile.
// after that it gets back and all middleware are run . 
// this route can be called by front-end to retrieve all information of the userId sent.

router.put('/user/:userId' , isSignedIn , isAuthenticated , updateUser)
// editing is only allowed is user is signedin and authenticated.
// all operations of user that need user to be signedin and authenticated uses these middleware.

router.get('/orders/user/:userId' , isSignedIn , isAuthenticated , userPurchaseList)
// Now we wan't to get all orders of a user.
// We will be cross-referencing two collections i.e. order and User so 
// populate in mongoose helps us to do so 
// our req.profile got filled because we have :userId



module.exports = router



