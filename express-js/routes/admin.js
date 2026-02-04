const express = require('express')
const path = require('path');
const rootDir = require('../utils/path')

const router = express.Router();

const products = [];


// /admin/add-product => GET 
router.get('/add-product',(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('add-product',{pageTitle:'Products'})
})

router.post('/add-product',(req,res)=>{
    products.push({title:req.body.title});
    res.redirect('/');
})


exports.route = router;
exports.products = products;