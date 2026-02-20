const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const {Server} = require('socket.io')

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express()

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString() + '-' + file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/png' ||file.mimetype ==='image/jpg'||file.mimetype ==='image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))
app.use(express.json());
app.use('/images',express.static(path.join(__dirname,'images')))


// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
//     next();
// })

app.use('/feed',feedRoutes)
app.use('/auth',authRoutes)

app.use((error,req,res,next)=>{
    console.log(error);
    const status =  error.statusCode || 500;
    const message = error.message;
    const data = error.data
    return res.status(status).json({message:message,data:data});
})


mongoose.connect('mongodb+srv://dhiraj:2003@cluster0.qptfc7w.mongodb.net/messages').then(result=>{
    const server = app.listen(8080,()=>{
        console.log('Server connection is established')
    })
    const io = require('./socket').init(server);

    io.on('connection',socket=>{
        console.log('Client connected')
    })

}).catch(err=>console.log(err))