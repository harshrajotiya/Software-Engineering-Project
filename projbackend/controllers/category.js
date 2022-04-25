const Category = require('../models/category')


exports.getCategoryById = (req, res , next , id) => {

    Category.findById(id).exec(
        (err , category) => {
            if(err || !category){
                return res.status(400).json({
                    error : "Category not found"
                })
            }
            req.category = category // we populate the category object that we got from id in req
            next()
        }
    )
    

}

exports.createCategory = (req, res ) => {
    const category = new Category(req.body) // we made a category object and put all information in it.
    category.save((err , category)=>{
        if(err){
            return res.status(400).json({
                error : "Not able to save category in DB"
            })
        }
        return res.json(category)
    })

}

exports.getCategory = (req , res) => {
    return res.json(req.category)
}
exports.getAllCategory = (req , res) => {
    // Category.find() gives us all entries of category schema.
    Category.find().exec(
        (err , categories)=>{
            if(err){
                return res.status(400).json({
                    error : "NO categories found"
                })
            }
            return res.json(categories)
        }
    )
}

exports.updateCategory = (req , res) => {
    const category = req.category
    category.name = req.body.name
    // please check more why have they done like this rather than doing the long procedure in uodateUser 
    category.save((err , updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error : "Failed to update category"
            })
        }
        return res.json(updatedCategory)
    })
}

exports.removeCategory =(req , res) => {

    const category = req.category
    category.remove((err , category) => {
        // here we might be confused why we have (err , category) and not only (err)
        // the category is there with err is the item that was just deleted for reference.
        if(err){
            return res.status(400).json({
                error : "Failed to delete category"
            })
        }
        return res.json({
            message : `${category.name} successfully deleted`
        })
    })

}