const { isSignedIn   , isAuthenticated} = require('../controllers/auth')
const { getToken , processPayment} = require('../controllers/paymentBRoutes')


const router = require('express').Router()

router.get("/payment/gettoken/:userId" , isSignedIn  , getToken)
// check why after adding isAutheenticated I was getting a bug.

router.post('/payment/braintree/:userId' , isSignedIn , isAuthenticated, processPayment)

module.exports = router