const Product = require('../models/product')
const formidable = require('formidable') // this is form-data instead of json and it enables us to add photo etc in DB.
const _ = require('lodash') // this is actual syntax . CHECK FROM DOCUMENTATION.
const fs = require('fs') // fileSystem is an inbuilt module.

exports.getProductById = (req, res ,next , id) => {
    Product.findById(id)
    .populate("category")
    .exec((err , product)=>{
        if(err){
            return res.status(400).json({
                error : "Product not found"
            })
        }
        req.product = product
        next()
    })

}

exports.createProduct = (req , res) => {
    // create Product
      // cheeck documentation for understanding syntax
    let form = new formidable.IncomingForm() ;
    form.keepExtensions = true // this helps us to say image extensions .jpeg , .png etc
    form.parse(req , (err , fields , file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"  // the problem is in file not fields here
            })
        }
        // destructure the fields
        const {name , description , price , category , stock} = fields
          // we can also put validation on routes also for these things that will be entered in DB.
          // it is always better to do this checking through validation error middleware format and not in the way
          // we are doing here.
        if(!name || !description || !stock || !category || !price){
            return res.status(400).json({
                error : "Please include all fields"
            })
        }



        let product = new Product(fields) // this creates product

        // handle file
        if(file.photo){
            if(file.photo.size > 3000000){ // this means file more than 3 mb.
                return res.status(400).json({
                    error : "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path) // this is where we mention the full path of our file using file system.
            product.photo.contentType = file.photo.type
        }
        
        // save to DB

        product.save((err , product) => {
            if(err){
                return res.status(400).json({
                    "error" : "Failed saving t-shirt in DB"
                })
            }
            return res.json(product)

        })

    })
}

exports.deleteProduct = (req,res) =>{
    let product = req.product

    // this is an object from mongoose so we can simple do product.remove of rremoving it
    // in category.js , we had an object from mongoose so we were directly able to update it.

    product.remove((err , deletedProduct) => {
        if(err ){
            return res.status(400).json({
                error : "Failed to delete the product"
            })
        }
        return res.json({message : "deleted successfully" , deletedProduct})
    })

}


exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm() ;
    form.keepExtensions = true // this helps us to say image extensions .jpeg , .png etc
    form.parse(req , (err , fields , file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"  // the problem is in file not fields here
            })
        }
        
        // updation code
        let product = req.product 
        product = _.extend(product , fields )    // this one lodash syntax updates the fields' value in DB. 

        // handle file
        if(file.photo){
            if(file.photo.size > 3000000){ // this means file more than 3 mb.
                return res.status(400).json({
                    error : "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path) // this is where we mention the full path of our file using file system.
            product.photo.contentType = file.photo.type
        }
        
        // save to DB

        product.save((err , product) => {
            if(err){
                return res.status(400).json({
                    "error" : "Updation of product failed"
                })
            }
            return res.json(product)

        })

    })
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 9  // is there is a query from front-end we use it else it is 8. In js all query comes as a string.
                                                                // we get query in form of string so we have to parse it .

    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"     // the parameter according to which we want to sort our data.     
    
    Product.find()
    .select("-photo")     // this doesn't select the photo attribute of the information
                            // we are doing this because extracting a photo takes time.
    .populate("category")
    .sort([[sortBy , "asc"]])
    .limit(limit)      // this tells how many photos do we want from the database.
    .exec((err , products) => {
        if(err){
            return res.status(400).json({
                error : "No product found"
            })
        }
        return res.json(products)
    })
}


exports.getProduct = (req, res) => {
    // getting images, mp3 can be  difficult and bulky using only a get request.
    // so we make photo parameter undefined and send it as json response.
    // now this request gets executed quiclky and we will run the photo middleware which will be responsible for
    // giving the image.  
    // The text loads first and the image will load slowly in the backend as it is done usually in websites.

    req.product.photo = undefined
    return res.json(req.product)
}

//middleware
exports.photo = (req , res) => {
    if(req.product.photo.data){
        // this is just a normal check if the request.product.photo.data has something or not.
        res.set("Content-Type" , req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
    // you will understand this properly after learning front-end portion.
}

exports.updateStock = (req,res , next) => {
    // we use next because it is a middleware

    // we update stock and sold both.
    // check syntax for bulkWrite for clearer understanding. 

    let myOperations  = req.body.order.products.map(prod => {
        // we loop through every product because we want to update for every product.
        return {
            updateOne : {
                filter : {_id : prod._id} ,    // we check the prod id and find it in DB using filter.  
                update : {$inc : {stock: -prod.count , sold: +prod.count}}
                //updation syntax. prod.count is a property from order. 
                // it signifies the count of a particular product in an order or count of a particular product buyer 
                // is ordering.
                                                               
            }
        }
    })

    Product.bulkWrite(myOperations , {} , (err , products) => {
        // {} is options. we don't need it right now so we leave it empty.
        if(err){
            return res.status(400).json({
                error : "Bulk operation failed"
            })
        }
        next()
    })
    

}

// this gives the same work as getAllCategories.
exports.getAllUniqueCategories = (req , res) => {
    // this also has options . We don't want options so we pass empty object.
    // .distinct() gives us all distinct or unique values here by the parameter given 
    Product.distinct("category" , {} , (err , category) => {
        if(err){
            return res.status(400).json({
                error : "No category found"
            })
        }
        return res.json(category)
    })
}

