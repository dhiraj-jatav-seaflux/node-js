const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto');
const {validationResult} = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:''
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage:message,
    oldInput:{
      email:"",
      password:""
    },
    validationErrors:[]
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message,
    oldInput:{
      email:"",
      password:"",
      confirmPassword:""
    },
    validationErrors:[]
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render('auth/login',{
      path: '/login',
      pageTitle: 'Login',
      errorMessage:errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password
      },
      validationErrors:errors.array()
    })
  }

  User.findOne({email:email}).then(user=>{
    if(!user){
      req.flash('error','Invalid email or password');
      return res.redirect('/login');
    }
    bcrypt.compare(password,user.password).then(doMatch=>{
      if(!doMatch){
      req.flash('error','Invalid email or password');
        return res.redirect('/login');
      }
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    }).catch(err=>console.log(err));
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:errors.array()[0].msg,
    oldInput:{
      email:email,
      password:password,
      confirmPassword:confirmPassword
    },
    validationErrors:errors.array()
  });
  }

  User.findOne({email:email}).then(userDoc=>{
    if(userDoc){
      req.flash('error','User alredy exists')
      return res.redirect('/signup')
    }
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = bcrypt.hashSync(password, salt);
    return bcrypt.hash(password,12).then(hashPassword=>{
    const user = new User({email:email,password:hashPassword,cart:{items:[]}});
    return user.save();
  }).then(result=>{
    res.redirect('/login');

    return transporter.sendMail({
      to:email,
      from:'dhiraj.jatav@seaflux.tech',
      subject:'Signup succeeded',
      html:'<h1>You successfully signed up!!</h1>'
    }).catch(err=>console.log(err));
    
  })
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next)=>{
  let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage:message
  });
}

exports.postReset = (req,res,next)=>{
  const email = req.body.email;

  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({email:email}).then(user=>{
      if(!user){
        req.flash('error','No account with the provided email');
        return res.redirect('/reset');
      }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      
    }).then(result=>{
      res.redirect('/')
      transporter.sendMail({
        to:email,
        from:'dhiraj.jatav@seaflux.tech',
        subject:'Password reset',
        html:`
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}"> link </a> to reset your password</p>
        
        `
      })
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
}

exports.getNewPassword=(req,res,next)=>{
  const token =req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt: Date.now()}}).then(user=>{
    let message = req.flash('error');
  if(message.length>0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'New Password',
    errorMessage:message,
    userId:user._id.toString(),
    passwordToken:token
  });
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
}

exports.postNewPassword = (req,res,next)=>{
  const token = req.body.passwordToken;
  const userId = req.body.userId;
  const newPassword = req.body.password;
  let resetUser;

  User.findOne({resetToken:token,_id:userId,resetTokenExpiration:{$gt:Date.now()}}).then(user=>{
    resetUser = user
    return bcrypt.hash(newPassword,12);
  }).then(hashedPassword=>{
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  }).then(result=>{
    res.redirect('/login')
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}