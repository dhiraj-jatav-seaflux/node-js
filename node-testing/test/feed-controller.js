require("dotenv").config();
const sinon = require("sinon");
const User = require("../models/user");
const expect = require("chai").expect;
const AuthController = require("../controllers/auth");
const feedController = require('../controllers/feed')
const mongoose = require("mongoose");

describe("Feed controller", function () {

  before(function (done) {
    mongoose.connect(process.env.MONGODB_URI_TEST).then((result) => {
      const user = new User({
        email: "test@mail.com",
        password: "12345",
        name: "Test",
        posts: [],
        _id: "5c0f66b979af55031b34728a",
      });
      return user.save();
    }).then(()=>{
        done()
    })
  });

  it("Should add the created post to the posts of the creator", function (done) {

    const req = {
      body:{
        title:'Testing',
        content:'A test',
      },
      file:{path:'abc'},
      userId:'5c0f66b979af55031b34728a'
    };

    const res = {
        status:function(){
            return this
        },
        json:function(){}
    }

    feedController.createPost(req,res,()=>{}).then((savedUser)=>{
        expect(savedUser).to.have.property('posts')
        expect(savedUser.posts).to.have.length(1)
        done()
    })
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });

});
