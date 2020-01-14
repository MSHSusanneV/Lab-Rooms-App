const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Room = require('../models/rooms');

router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
        next(); // ==> go to the next route ---
    } else {                          //    |
        res.redirect("/login");         //    |
    }                                 //    |
});

router.get('/rooms-all', (req, res, next) => {
    Room.find()
        .then(AllRooms => {
            res.render('rooms_all', { AllRooms });
        })
        .catch(error => {
            console.log(error);
        })
});

/* Edit Room */
router.get('/room/:id/edit', (req, res, next) => {
    Room.findById({ '_id': req.params.id })
        .then(theRoom => {
            res.render('edit', { theRoom });
        })
        .catch(error => { next(error) })
});

router.post('/room/:id/edit', (req, res, next) => {
    const { name, description, imageUrl, review } = req.body;
    Room.updateOne({ '_id': req.params.id }, { $set: { name, description, imageUrl, review } })
        .then((theRoom) => {
            res.redirect('/room')
        })
        .catch(error => { next(error) }
        ); 
        
});

/* Delete Room */
router.get('/room/:id/delete', (req, res, next) => {
    Room.findById({ '_id': req.params.id })
        .then(theRoom => {
            res.render('delete', { theRoom });
        })
        .catch(error => { next(error) })
});

router.post('/room/:id/delete', (req, res, next) => {
    const { name, description, imageUrl, review } = req.body;
    Room.findByIdAndRemove({ '_id': req.params.id })
        .then((theRoom) => {
            res.redirect('/room')
        })
        .catch(error => { next(error) }
        ); 
        
});


/* Rooms Create */
router.get('/room', (req, res, next) => {
    res.render('room');
});


router.post("/room", (req, res, next) => {
    // console.log("post: /room");
    const name = req.body.name;
    const description = req.body.description;
    const imageUrl = req.body.imgUrl;
    const owner = req.session.currentUser;
    // const reviews = []; //req.body.review;

    console.log(name, description);
    console.log(req.session.currentUser);

    /* Create Room */
    Room.findOne({ "name": name })
        .then(roomFromDB => {
            if (roomFromDB !== null) {
                res.render("/room", {
                    errorMessage: "The Room already exists!"
                });
                return;
            }

            Room.create({
                name,
                description,
                imageUrl,
                owner
            })
                .then(() => {
                    console.log("Room create:");
                    res.redirect("/");
                })
                .catch(error => {
                    console.log(error);
                })
        })

});



/* Login Page */
/* router.get('/login', (req, res, next) => {
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


}); */

module.exports = router;
