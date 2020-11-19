var localStrategy = require('passport-local').Strategy;
const Teacher = require('../models/Teacher');
const Student= require('../models/Student');
const bcrypt = require('bcryptjs');

module.exports= function (passport) {
    passport.use('Teacher',new localStrategy({usernameField: 'email',}, (email, password, done) => {
        Teacher.findOne({ email: email }, (err, data) => {
            if (err) throw err;
            if (!data) {
                return done(null, false, { message: "User Doesn't Exists.." });
            }
            bcrypt.compare(password, data.password, (error, match) => {
                if (error) {
                    return done(null, false);
                }
                if (!match) {
                    return done(null, false, { message: "Password Doesn't Match" });
                }
                if (match) {
                    return done(null, data);
                }
            });
        });
    }));

    passport.use('Student',new localStrategy({usernameField: 'email',}, (email, password, done) => {
        Student.findOne({ email: email }, (err, data) => {
            if (err) throw err;
            if (!data) {
                return done(null, false, { message: "User Doesn't Exists.." });
            }
            bcrypt.compare(password, data.password, (error, match) => {
                if (error) {
                    return done(null, false);
                }
                if (!match) {
                    return done(null, false, { message: "Password Doesn't Match" });
                }
                if (match) {
                    return done(null, data);
                }
            });
        });
    }));


    // passport.serializeUser(function (user, cb) {
    //     cb(null, user.id);
    // });

    passport.serializeUser(function (user, cb) {
        cb(null, {id: user.id, type: user.type});
    });

    // passport.deserializeUser(function (id, cb) {
    //     Users.findById(id, function (err, user) {
    //         cb(err, user);
    //     });
    // });

    passport.deserializeUser(function (obj, done) {
        switch (obj.type) {
            case 'Student':
                Student.findById(obj.id)
                    .then(user => {
                        if (user) {
                            done(null, user);
                        }
                        else {
                            done(new Error('Student not found:' + obj.id, null));
                        }
                    });
                break;
            case 'Teacher':
                Teacher.findById(obj.id)
                    .then(user => {
                        if (user) {
                            done(null, user);
                        } else {
                            done(new Error('Teacher not found:' + obj.id, null));
                        }
                    });
                break;
            default:
                done(new Error('no login type:', obj.type), null);
                break;
        }
    });

}
