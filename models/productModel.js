const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_id:{
        type:String,
        unique:true,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    checked:{
        type:Boolean,
        default:false
    },
    sold:{
        type:Number,
        default:0
    }
},
{timestamps:true}
)




module.exports = mongoose.model('Products',productSchema)