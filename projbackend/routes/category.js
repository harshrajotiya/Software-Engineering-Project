const router = require('express').Router()
const {getCategoryById , createCategory , getCategory , getAllCategory , updateCategory, removeCategory} = require('../controllers/category')
const {isSignedIn , isAuthenticated , isAdmin} = require('../controllers/auth') 
const {getUserById} = require('../controllers/user') // auth and user controllers are extracted beacuse we want to use
                                                    // callback functions present in them


//params

router.param('userId' , getUserById)
// we use this param so that we get the information of user in req.profile

router.param('categoryId' , getCategoryById)
// a new param is made for getting the category information using id.

// routes

// create category routes
router.post('/category/create/:userId' , isSignedIn , isAuthenticated , isAdmin , createCategory )
// only an admin can create a category

// read routes. anyone can read what category a product belons to. 
router.get('/category/:categoryId' , getCategory )
router.get('/categories' , getAllCategory)

//update route
// only admin an update a category 
router.put('/category/:categoryId/:userId' , isSignedIn , isAuthenticated , isAdmin , updateCategory )

// delete route
router.delete('/category/:categoryId/:userId' , isSignedIn , isAuthenticated , isAdmin , removeCategory )
// only admin can delete a category

module.exports = router
