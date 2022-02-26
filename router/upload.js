const router = require('express').Router()
const cloudinary = require('cloudinary')
const fs = require('fs')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
})




router.post('/upload',auth,authAdmin , (req,res)=>{
    try {
        
        if(!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({msg:'no files were uploaded'})

        const file = req.files.file
        if(file.size > 1024*1024){
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg:"File size is too large"})
        }
        
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg:"File format is incorrect"})
        }
        

        cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"ecommers"}, async (err,result)=>{
            if(err) throw err
            removeTemp(file.tempFilePath)
            res.json({public_id: result.public_id,url: result.url})
        })

    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
})

router.post('/destroy',auth,authAdmin , (req,res)=>{
    try {
        const {public_id} = req.body
        if(!public_id) return res.status(400).json({msg:"No image selected"})
        cloudinary.v2.uploader.destroy(public_id, async (err,result)=>{
            if(err) throw err
            res.json({msg:"Delete imgae"})
        })
    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
})

const removeTemp = (path)=>{
    fs.unlink(path,err=>{
        if(err) throw err;
    })
}


module.exports = router