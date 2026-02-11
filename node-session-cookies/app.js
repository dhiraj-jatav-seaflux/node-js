const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGOdB_URI = "mongodb+srv://dhiraj:2003@cluster0.qptfc7w.mongodb.net/shop"

const store = new MongoDBStore({
  uri:MONGOdB_URI,
  collection:'sessions'
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'My secret',
  resave:false,
  saveUninitialized:false,
  store:store
}));

app.use((req,res,next)=>{
  if(!req.session.user){
    return next();
  }
 User.findById(req.session.user._id).then(user=>{
  req.user = user;
  next();
 }).catch(err=>console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGOdB_URI)
  .then((result) => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Dhiraj",
            email: "test@mail.com",
            cart: {
              items: [],
            },
          });
          user.save();
        }
      })
    app.listen(3000);
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

