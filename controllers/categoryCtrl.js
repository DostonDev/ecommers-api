const Category = require('../models/categoryModel') 

const categoryCtrl = {
    getCategories: async (req,res)=>{
        try {
            const category = await Category.find()
            res.json({category})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createCategory: async (req,res)=>{
        try {
            
            const {name} = req.body
            const category = await Category.findOne({name})
            if(category) return res.status(400).json({msg:"This Category already exist"})

            const newC = new Category({name})
            await newC.save()
            res.json({msg:"Create Category"})

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteCategory: async (req,res)=>{
        try {
            await Category.findByIdAndDelete(req.params.id)
            return res.json({msg:"Delete Category"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateCategory: async (req,res)=>{
        try {
            const {name} = req.body
            await Category.findOneAndUpdate({_id:req.params.id},{name})
            return res.json({msg:"Update Category"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}


module.exports = categoryCtrl