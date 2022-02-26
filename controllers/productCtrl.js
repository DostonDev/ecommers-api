const Products = require('../models/productModel')



class APIfeatures {
    constructor(query,queryString){
        this.query = query,
        this.queryString = queryString
    }
    filtering(){
        const queryObj = {...this.queryString}
        const excludedFields = ['page','sort','limit']
        excludedFields.forEach(el=> delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match=> '$'+ match)
        this.query.find(JSON.parse(queryStr))

        return this
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy);
            this.query = this.query.sort(sortBy)
        }
        else(
            this.query = this.query.sort('createdAt')
        )
        return this
    }
    pagination(){
        const page = this.queryString.page * 1
        const limit = this.queryString.limit *1
        const skip = (page-1)*limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}





const productCtrl = {
    getProducts: async (req,res)=>{
        try {
            const features = new APIfeatures(Products.find(),req.query).filtering().sorting().pagination()
            const products = await features.query
            return res.json({
                statsus:"success",
                result:products.length,
                products
            })
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createProducts: async (req,res)=>{
        try {
            const {product_id,title,price,description,content,image,category} = req.body
            if(!image) return res.status(400).json({msg:"No Image upload"})
            // const proudct = await new Products.findOne({product_id})
            // if(proudct) return res.status(400).json({msg:"This Product already exists"})
            const newProduct = new Products({
                product_id,title:title.toLowerCase(),price,description,content,image,category
            })
            await newProduct.save()
            return res.json({msg:"create product"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteProducts: async (req,res)=>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            return res.json({msg:"delete product"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateProducts: async (req,res)=>{
        try {
            const {product_id,title,price,description,content,image,category} = req.body
            if(!image) return res.status(400).json({msg:"No Image upload"})
            await Products.findByIdAndUpdate({_id: req.params.id},{
                title:title.toLowerCase(),price,description,content,image,category
            })
            return res.json({msg:"Update Product"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}


module.exports = productCtrl