const express = require("express");
const router = express.Router();

router.get("/protected", (req, res, next) => {
    res.render("main");
});
/* 
router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
        next(); // ==> go to the next route ---
    } else {                          //    |
        res.redirect("/login");         //    |
    }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/protected/room", (req, res, next) => {
    res.render("room");
});

module.exports = router;