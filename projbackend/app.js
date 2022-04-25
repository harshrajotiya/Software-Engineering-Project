require('dotenv').config();

const mongoose = require('mongoose')
const express = require('express')
const app = express()  

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')

const paymentBRoutes = require('./routes/paymentBRoutes')

// we are calling our data base tshirt . 

// Database connection
mongoose.connect( process.env. DATABASE, {
     useNewUrlParser : true,    // compulsary
     useUnifiedTopology : true,
     useCreateIndex : true
} ).then(() => {
    console.log("DB CONNECTED")
}).catch(()=>{
    console.log("DB FAILED")
})

// Middleware
// These are run as all these middlewares are run before any route path request. 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors())

// My Routes        We are making another middleware here
app.use('/api' ,authRoutes )
app.use('/api' , userRoutes)
app.use('/api' , categoryRoutes)
app.use('/api' , productRoutes)
app.use('/api' , orderRoutes)
app.use('/api' , paymentBRoutes)

// PORT
const port = process.env.PORT || 8000 ;

// Starting a server.
app.listen(port , ()=>{
    console.log(`app listening at ${port}`)
})
