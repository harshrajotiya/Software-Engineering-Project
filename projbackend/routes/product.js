const router = require('express').Router()

const {getProductById , createProduct , getProduct , photo , deleteProduct , updateProduct ,getAllProducts,
getAllUniqueCategories} = require('../controllers/product')
const {isAdmin , isAuthenticated , isSignedIn} = require('../controllers/auth') // we require this to authenticate a user for verifying whether he can add a 
                                            // product or not
const {getUserById} = require('../controllers/user') 

// all of params
router.param("userId" , getUserById)
router.param("productId" , getProductById)

// all of routes
// create route
router.post('/product/create/:userId' , isSignedIn , isAuthenticated , isAdmin , createProduct) 
// :userId will populate req.profile

//read routes
router.get('/product/:productId' , getProduct)
router.get('/product/photo/:productId' , photo)

//delete route
router.delete('/product/:productId/:userId' , isSignedIn , isAuthenticated , isAdmin , deleteProduct)

//update route
router.put('/product/:productId/:userId' , isSignedIn , isAuthenticated , isAdmin , updateProduct)

// listing route
router.get('/products' , getAllProducts) 

router.get('/products/categories' , getAllUniqueCategories)


module.exports = router ;