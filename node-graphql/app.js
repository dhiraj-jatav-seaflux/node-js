require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const {graphqlHTTP} = require('express-graphql')
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middlewares/auth')
const {clearImage} = require('./util/file')
const helmet = require('helmet')

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

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))
app.use(express.json());
app.use('/images',express.static(path.join(__dirname,'images')))

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(auth)

app.put('/post-image',(req,res,next)=>{
    if(!req.isAuth){
        throw new Error('User not authenticated')
    }
    if(!req.file){
        return res.status(200).json({message:'No image provided'})
    }
    if(req.body.oldPath){
        clearImage(req.body.oldPath)
    }
    console.log(req.file.path)
    return res.status(201).json({message:'File stored',filePath:req.file.path})
})


app.use('/graphql',graphqlHTTP({
    schema: graphqlSchema,
    rootValue:graphqlResolver,
    graphiql:true,
    formatError(err){
        if(!err.originalError){
            return err;
        }
        const data = err.originalError.data
        const message = err.message || 'An error occured';
        const code = err.originalError.code || 500
        return {
            message:message,
            status:code,
            data:data
        }
    }
}))

app.use((error,req,res,next)=>{
    console.log(error);
    const status =  error.statusCode || 500;
    const message = error.message;
    const data = error.data
    return res.status(status).json({message:message,data:data});
})


mongoose.connect(process.env.MONGODB_URI).then(result=>{
    app.listen(8080,()=>{
        console.log('Server connection is established')
    })
    

}).catch(err=>console.log(err))