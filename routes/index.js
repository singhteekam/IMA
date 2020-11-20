const express= require('express');
const app= express.Router();
const bodyParser= require('body-parser');
const ejs= require('ejs');
const bcrypt= require('bcrypt');
const nodemailer= require('nodemailer');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const signUp= require('./User/signUp');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

require('./passportLogin')(passport);

app.use(cookieParser('secret'));
app.use(session({
    secret: process.env.SECRET_KEY,
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
}));
// using passport for authentications 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/signUp', function(req,res){
    res.render('signUp');
});

app.get('/stuDash', function(req,res){
    res.render('studentdashboard');
});
app.get('/updateDash', function(req,res){
    res.render('updateDash');
});

app.get('/displayUser', function(req,res){
    if(req.user.type==="Teacher"){
        Student.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render('displayuser', { "users": users });
    })
    }
    else if(req.user.type==="HOD"){
        Teacher.find({}).exec(function(err, users) {   
            if (err) throw err;
            res.render('displayuser', { "users": users });
        })
    }
});

app.get('/search', function(req,res){
    res.render('search', {
        "user": req.user.type
    });
});

app.post('/search', function(req,res){
    // User.find({
    //     "$text": {
    //         "$search": req.body.searchBox
    //     }
    // }).toArray(function(err,items){
    //         res.render('searched',{"datas": items});
    // })

    if(req.user.type==="Teacher"){
        Student.find({
            username: req.body.searchBox
        }).exec(function(err, users) {   
            if (err) throw err;
            res.render('searchresult', { "datas": users });
        })
    }


});



app.post('/login', (req, res, next) => {
    if(req.body.type === "Teacher"){
    passport.authenticate('Teacher', {
        failureRedirect: '/login',
        successRedirect: '/dashboard',
        failureFlash: true,
    })(req, res, next);
    }
    else{
        passport.authenticate('Student', {
            failureRedirect: '/login',
            successRedirect: '/dashboard',
            failureFlash: true,
        })(req, res, next);
    }
});

const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

app.post('/signUp', signUp);

app.get('/dashboard',checkAuthenticated, (req, res)=>{
    res.render('dashboard', {
        "data": req.user
    });
})

app.get('/addNewUser', function(req,res){
    res.render('addNewUser');
});

app.post('/addNewUser', signUp);

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get('/addMarks', (req, res)=>{
    let email= req.query.email.trim();
    Student.findOne({
        email: email
    }).then((user)=>{
        res.render('addMarks', {
            "data": user
        })
    })
});

app.post('/addMarks', (req, res)=>{
    let email = req.query.email.trim();
    let updateData;
    if(req.body.examType==="ST1"){
    updateData = {
        physicsST1: req.body.physics,
        physicsST1TM: req.body.physicsTM,
        chemistryST1: req.body.chemistry,
        chemistryST1TM: req.body.chemistryTM,
        mathsST1: req.body.maths,
        mathsST1TM: req.body.mathsTM,
     }
    }
    else if(req.body.examType==="ST2"){
        updateData = {
            physicsST2: req.body.physics,
            physicsST2TM: req.body.physicsTM,
            chemistryST2: req.body.chemistry,
            chemistryST2TM: req.body.chemistryTM,
            mathsST2: req.body.maths,
            mathsST2TM: req.body.mathsTM,
         }
    }
    else if(req.body.examType==="PUE"){
        updateData = {
            physicsPUE: req.body.physics,
            physicsPUETM: req.body.physicsTM,
            chemistryPUE: req.body.chemistry,
            chemistryPUETM: req.body.chemistryTM,
            mathsPUE: req.body.maths,
            mathsPUETM: req.body.mathsTM,
         }
    }
    Student.updateOne({
        "email": email
    }, {
        $set: updateData
    }).then((user)=>{
        res.render('dashboard', {
            "data": req.user
        })
    })
});

app.get("/viewMarksStu", (req, res)=>{
    res.render('./Student/viewMarks', {
        "data": req.user
    })
})

module.exports=app;


