const express = require('express')
const path = require('path')
const rootDir = require('../utils/path')
const adminData = require('../routes/admin')

const router = express.Router();

router.get('/',(req,res)=>{
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    const products = adminData.products;
    // console.log(products);
    // res.render('shop',{prods:products,pageTitle:'My Shop'}); for pug
    res.render('shop',{prods:products,pageTitle:'My Shop',hasProducts:products.length>0});
})


module.exports = router;