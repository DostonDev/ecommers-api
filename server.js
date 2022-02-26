require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fileupload = require('express-fileupload')
const cookieparser = require('cookie-parser')


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieparser())
app.use(fileupload({
    useTempFiles: true
}))





//router
app.use('/user',require('./router/userRouter'))
app.use('/api',require('./router/categoryRouter'))
app.use('/api',require('./router/productRouter'))
app.use('/api',require('./router/upload'))


//connect mongodb
mongoose.connect(process.env.ATLAS,{useNewUrlParser: true},()=>{
    console.log("connect");
})








app.listen(process.env.PORT,()=>{
    console.log("Listen server");
})