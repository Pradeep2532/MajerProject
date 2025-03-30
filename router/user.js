const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAysnc = require("../utils/wrapAysnc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router
.route("/signup")
.get( (req, res) => {
    res.render("users/signup.ejs");
})
.post( wrapAysnc(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        // console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to wonderlust!");
            res.redirect("/listing")
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))

router.route("/login")
.get((req, res) => {
    res.render("users/login.ejs");
})
.post( saveRedirectUrl , passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to Wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing"

    res.redirect(redirectUrl);
})


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next()
        }
        req.flash("success", "you loged out!");
        res.redirect("/listing");
    })
})

module.exports = router;