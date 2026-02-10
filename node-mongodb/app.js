const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoConnect = require("./util/database").mongoConnect
const errorController = require("./controllers/error");
const User = require('./models/user')

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next)=>{
    User.findById('6989b2d25df074cbbb724551').then(user=>{
        req.user = user;
        // console.log(req.user)
        next();
    }).catch(err=>console.log(err))
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);


mongoConnect(()=>{
  const user = new User('Dhiraj','test@mail.com');
  
  user.save().then(user=>{
    console.log(user);
    app.listen(3000);
  }).catch(err=>console.log(err))
})


