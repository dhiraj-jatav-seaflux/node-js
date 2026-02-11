const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1] === "true" ? true : false;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("698b06e2113ad9976f8bd114")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save(err=>{
        if(err){
          console.log(err);
        }
        res.redirect("/");
      })
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req,res,next)=>{
  req.session.destroy(err=>{
     if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
}