const express = require('express');
const cors = require('cors');

const feedRoutes = require('./routes/feed');

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cors());

// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
//     next();
// })

app.use('/feed',feedRoutes)

app.listen(8080,()=>{
    console.log('Server is running')
})