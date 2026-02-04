const Product = require('../models/product')

exports.getAddProduct = (req,res,next)=>{
    res.render('add-product',{pageTitle:'Products'})
}

exports.postAddProduct = (req,res)=>{
    // products.push({title:req.body.title});
    const product = new Product(req.body.title)
    product.save();
    res.redirect('/');
}

exports.getProducts = (req,res)=>{
    Product.fetchAll((products)=>{
        res.render('shop',{prods:products,pageTitle:'My Shop',hasProducts:products.length>0});
    });
}