const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register: async (req,res)=>{
        try {
            const {name,email,password} = req.body
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg:"This email aleady exists"})
            if(password.length < 6) return res.status(400).json({msg:"lenght>6"})
            const hashPassword = await bcrypt.hash(password,10)

            const newUser = new Users({
                name,
                email,
                password:hashPassword
            })
            
            await newUser.save()

            const accestoken = createAccsessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token'
            })

            res.json({accestoken})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
       
    },
    login: async (req,res)=>{
        try {
            const {email,password} = req.body;
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg:"User do not exsist"})
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({msg:"Incorrect Password"})

            const accestoken = createAccsessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})
            res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token'
            })

            return res.json({accestoken})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    logout: async (req,res)=>{
        try {
            res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
            return res.json({msg:"logout success"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    getUser: async (req,res)=>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg:"user does not exist"})
            
            return res.json(user)
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    refreshToken: async (req,res)=>{
        try {
            const rf_token = req.cookies.refreshtoken
            // console.log(req.cookies.refreshtoken);
            if(!rf_token) return res.status(400).json({msg:"Please Login or Register"})

            jwt.verify(rf_token,process.env.REFRESH_TOKEN,(err,user)=>{
                if(err) return res.status(400).json({msg:"login or register now"})
                const accestoken = createAccsessToken({id:user.id})
                return res.status(200).json({accestoken})
            })
            
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
        
    }
            
}



const createAccsessToken = (user) =>{
    return jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1d'})
}

const createRefreshToken = (user) =>{
    return jwt.sign(user,process.env.REFRESH_TOKEN,{expiresIn:'7d'})
}

module.exports = userCtrl