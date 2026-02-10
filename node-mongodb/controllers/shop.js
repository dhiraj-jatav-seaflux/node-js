const Product = require("../models/product");


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findOne(productId).then(product=>{
    res.render("shop/product-detail", {
        product: product,
        pageTitle: "product",
        path: "/products",
      });
  }).catch(err=>{
    console.log(err);
  })


  // This provides array
  // Product.findAll({ where: { id: productId } })
  //   .then((products) => {
  //     res.render("shop/product-detail", {
  //       product: products[0],
  //       pageTitle: "product",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));

  // This provides a single record based on the primary key
  // Product.findByPk(productId).then(products=>{
  //   res.render('shop/product-detail',{product:products, pageTitle:'product', path:'/products'})
  // }).catch(err=>console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
          
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findOne(prodId).then(product=>{
    return req.user.addToCart(product);
  }).then(()=>{
    res.redirect('/cart')
  }).catch(err=>console.log(err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId).then(result=>{
    res.redirect('/cart');
  }).catch(err=>console.log(err));
  // req.user.getCart().then(cart=>{
  //   return cart.getProducts({where:{id:prodId}})
  // }).then(products=>{
  //   const product = products[0];
  //   return product.cartItem.destroy();
  // }).then(result=>{
  //   res.redirect("/cart");

  // }).catch(err=>console.log(err));
};

exports.postOrder = (req,res,next)=>{
  let fetchedCart;
  req.user.addOrder().then(result=>{
    return fetchedCart.setProducts(null)
  }).then(result=>{
    res.redirect('/orders')
  }).catch(err=>console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then(orders=>{
    res.render("shop/orders", {
      orders:orders,
      path: "/orders",
      pageTitle: "Your Orders",
    });
  }).catch(err=>console.log(err))
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
