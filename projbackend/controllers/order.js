const {Order , ProductCart} = require('../models/order')
//ProductCart is ProdcutCartSchema eg. in orders we had [ProductCartSchema]


exports.getOrderById = (req , res , next , id) =>{
    Order.findById(id)
    .populate("products.product" , "name price") // we are populating the products in order. 
                                                // products.product   part will get more clear after front-end
    .exec( (err , order) =>{
        if(err){
            return res.status(400).json({
                error : "No order found in DB"
            })
        }
        req.order = order
        next()
    } )
}

exports.createOrder = (req,res) => {
    // we want to use req.profile because  for saving an order to DB ,we also have to give the user field present 
    // in the Order Schema.

    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err , order) => {
        if(err){
            return res.status(400).json({
                error : "Failed to save your order in DB"
            })
        }
        return res.json(order)
    })
}

exports.getAllOrders = (req , res) => {
    Order.find()
    .populate("user" , "_id name")
    .exec((err , orders) => {
        if(err){
            return res.status(400).json({
                error : "No orders found in DB"
            })
        }
        return res.json(orders)
    })
}

exports.getOrderStatus = (req , res) => {
    return res.json(Order.schema.path("status").enumValues) 
    // we are returning all possible values a attribute status
    // can get. This  helps us restrict the user from giving this value from only this set from front-end. 
}
exports.updateStatus = (req , res) => {
    Order.update(
        {_id : req.body.orderId} ,
        {$set : {status : req.body.status}} ,
        (err , order) => {
            if(err){
                return res.status(400).json({
                    error : "cannot update status" 
                })
            }
            return res.json(order)
        }
    )
}