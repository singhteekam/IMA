const express= require('express');
const router= express.Router();
const bodyParser= require('body-parser');
const ejs= require('ejs');
const bcrypt= require('bcrypt');
const nodemailer= require('nodemailer');
const jwt= require('jsonwebtoken');


router.get('/',(req,res)=>{
    res.render('home.html');
});

router.get('/login',(req,res)=>{
    res.render('login.html');
});

router.get('/',(req,res)=>{
    res.render('home.html');
});
router.get('/signUp', function(req,res){
    res.render('signUp.html');
});

router.get('/stuDash', function(req,res){
    res.render('studentdashboard');
});
router.get('/updateDash', function(req,res){
    res.render('updateDash');
});

router.get('/displayUser', function(req,res){
    User.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render('displayuser', { "users": users });
    })
});

router.get('/search', function(req,res){
    res.render('search');
});

router.post('/search', function(req,res){
    // User.find({
    //     "$text": {
    //         "$search": req.body.searchBox
    //     }
    // }).toArray(function(err,items){
    //         res.render('searched',{"datas": items});
    // })

    User.find({
        username: req.body.searchBox
    }).exec(function(err, users) {   
        if (err) throw err;
        res.render('searchresult', { "datas": users });
    })

});

router.post('/signUp',function(req,res){
    const signUp={
     username:req.body.username,
     email:req.body.email,
     phone:req.body.phone,
    password:req.body.password
    }
    User.findOne({
        email:req.body.email
    }).then(user=>{
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                signUp.password=hash;
                User.create(signUp).then(user=>{
                    // res.json({status:user.email+'  Registered'});


                    let transporter = nodemailer.createTransport({
                        // host: 'mail.dev25.com',
                        service:'Gmail',
                        // port: 587,
                        // secure: false, // true for 465, false for other ports
                        auth: {
                            user: process.env.USER_MAIL, // generated ethereal user
                            pass: process.env.USER_PASS  // generated ethereal password
                        },
                        tls:{
                          rejectUnauthorized:false
                        }
                      });
                    
                      // setup email data with unicode symbols
                      let mailOptions = {
                          from: '"Devs Team" <dynamicdevs.ima@gmail.com>', // sender address
                          to: req.body.email, // list of receivers
                          subject: 'Account Created!!', // Subject line
                        //   text: 'Hello '+req.body.username+', ' +'\nYour instagram account has been hacked successfully.\n\nThank You.', // plain text body
                        text: 'Hello '+req.body.username+', ' +'\nYour account has been registered successfully.\n\nThank You.',
                      };
                    
                      // send mail with defined transport object
                      transporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                              return console.log(error);
                          }
                          console.log('Message sent: %s', info.messageId);   
                          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    
                          res.render('emailsent', {msg:'Email has been sent'});
                      });


                    res.render('studentdashboard',{data : req.body});
                    console.log(req.body);
                }).catch(err=>{
                    res.send('error'+err);
                })
            })
        }
        else{
            res.json({error:"User already exists"});
        }
    })

});

router.post('/login',function(req,res){
    User.findOne({
        username:req.body.username
    }).then(user=>{
        if(user){
            if(bcrypt.compareSync(req.body.password,user.password)){        //bcrypt.compareSync(req.body.password,user.password)
                const payload={
                    _id:user._id,
                    username:user.username,
                    email:user.email,
                    phone:user.phone,
                    password:user.password
                }
                let token=jwt.sign(payload,process.env.SECRET_KEY,{
                    expiresIn:1440
                });
                // res.send(token);
                res.render('studentdashboard',{data:payload});
            }else{
                res.json({error:'Incorrect password'});
            }
        } else{
            res.json({error:'User does not exist!!!'});
        }
    })
    .catch(err=>{
        console.log(err);
    })
});

module.exports=router;


