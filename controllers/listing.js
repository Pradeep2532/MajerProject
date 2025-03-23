const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.create = async (req, res, next) => {
    // console.log(req.body.listing)
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
};

module.exports.edite = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested is don't exist!");
        res.redirect("/listing");
    }
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/uplod", "/uplode/w_250")
    res.render("listings/edit.ejs", { listing,orignalImageUrl });
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate:{path : "author"}, }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested is don't exist!");
        res.redirect("/listing");
    }
    // console.log(listing.owner.username)
    res.render("listings/show.ejs", { listing });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof(req.file)!== "undefined"){
   let url = req.file.path;
   let filename = req.file.filename;
    listing.image = {url , filename}
    listing.save();
   }
    req.flash("success", " Listing Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing Deleted");
    res.redirect("/listing");

};