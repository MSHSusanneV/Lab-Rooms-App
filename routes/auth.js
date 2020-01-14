const express = require('express');
const router = express.Router();

const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

/* SignUp Page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post("/signup", (req, res, next) => {
    // console.log("post: /signup");
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;
    console.log(email);
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (email === "" || password === "" || fullName === "" ) {
        res.render("auth/signup", {
            errorMessage: "Please enter Email and Password and fullName!"
        });
        return;
    }

    User.findOne({ "email": email })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render("auth/signup", {
                    errorMessage: "The Email already exists!"
                });
                return;
            }

            User.create({
                email,
                password: hashPass,
                fullName
            })
                .then(() => {
                  // console.log("User create:");  
                  res.redirect("/");
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            next(error);
        })
});

/* Login Page */
router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post("/login", (req, res, next) => {
      const theEmail = req.body.email;
      const thePassword = req.body.password;
      const theFullName = req.body.fullName;
    
    if (theEmail === "" || theFullName === "" || thePassword === "") {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to sign in."
        });
        return;
    }

    User.findOne({ "email": theEmail })
        .then(userFromDB => {
            if (!userFromDB) {
                res.render("auth/login", {
                    errorMessage: "The Email doesn't exist."
                });
                return;
            }
            if (bcrypt.compareSync(thePassword, userFromDB.password)) {
                // Save the login in the session!
                req.session.currentUser = userFromDB;
                let UserId = req.session.currentUser._id; 
                console.log(UserId);
                res.redirect("/");
            } else {
                res.render("auth/login", {
                    errorMessage: "Incorrect password"
                });
            }
        })
        .catch(error => {
            next(error);
        })


});

module.exports = router;
