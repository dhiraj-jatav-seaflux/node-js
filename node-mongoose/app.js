const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("698ac893e8017376bc82e734")
    .then((user) => {
      req.user = user;
      // console.log(req.user)
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb+srv://dhiraj:2003@cluster0.qptfc7w.mongodb.net/")
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
