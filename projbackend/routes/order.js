const router = require('express').Router()

const {isSignedIn , isAuthenticated , isAdmin} = require('../controllers/auth')
const {getUserById , pushOrderInPurchaseList} = require('../controllers/user')
// pushOrderInPurchaseList was a middleware made by us to push orders into purchase list of user.

const {updateStock} = require('../controllers/product')
const {getOrderById, createOrder , getAllOrders, getOrderStatus , updateStatus} = require('../controllers/order')
const { route } = require('./product')

// params
router.param("userId" , getUserById)
router.param("orderId" , getOrderById)

// actual routes

//create 
router.post('/order/create/:userId' , isSignedIn , isAuthenticated , pushOrderInPurchaseList , updateStock , createOrder)
// anyone who puts an order is not an admin so isAdmin is not required.
// there can be other ways of creating an order as well. 

router.get('/order/all/:userId' , isSignedIn , isAuthenticated , isAdmin , getAllOrders) 

// status of order
// we give the admin access to all orders and its status because admin needs this info to process these requests.

router.get('order/status/:userId' , isSignedIn , isAuthenticated , isAdmin , getOrderStatus )
//getting all the possible status of order there can be. So that iwe only show them and we don't get confused.

router.put('/order/:orderId/status/:userId' , isSignedIn , isAuthenticated, isAdmin , updateStatus)
// updating status of order


module.exports = router
