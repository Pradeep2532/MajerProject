const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAysnc = require("../utils/wrapAysnc.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudeConfig.js")
const upload = multer({storage})

router
.route("/")
.get(wrapAysnc(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAysnc(listingController.create),);



//New Route
router.get("/new", isLoggedIn, listingController.new);


router
.route("/:id")
.get( wrapAysnc(listingController.show))
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAysnc(listingController.update))
.delete( isLoggedIn, isOwner, wrapAysnc(listingController.delete))



//Edite Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAysnc(listingController.edite));

module.exports = router 