const express = require('express');
const router = express.Router();

const Room = require("../models/user");


/* Room CRUD */
router.get('/room', (req, res, next) => {
    res.render('room');
});

// router.post("/room", (req, res, next) => {
    // console.log("post: /room");
    const nameRoom = req.body.name;
    const descriptionRoom = req.body.description;
    const imgRoom = req.body.imgUrl;
    
    if (nameRoom === "" || descriptionRoom === "" || imgRoom === "" ) {
        res.render("auth/signup", {
            errorMessage: "Please enter Name / Description / Image!"
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
