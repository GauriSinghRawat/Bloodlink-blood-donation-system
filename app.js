const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Donor = require("./models/donor");

const app = express();


// DATABASE CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/bloodlink")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});


// VIEW ENGINE
app.set("view engine", "ejs");


// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));


// HOME ROUTE
app.get("/", async (req, res) => {

    const donors = await Donor.find({});

    res.render("index", { donors });

});

app.get("/search", async (req, res) => {

    const blood = req.query.bloodGroup;

    const donors = await Donor.find({
        bloodGroup: blood
    });

    res.render("index", { donors });

});

// NEW FORM ROUTE
app.get("/donors/new", (req, res) => {

    res.render("new");

});


// CREATE ROUTE
app.post("/donors", async (req, res) => {



    const donor = new Donor(req.body);

    await donor.save();

    res.redirect("/");

});

app.delete("/donors/:id", async (req, res) => {

    let { id } = req.params;

    await Donor.findByIdAndDelete(id);

    res.redirect("/");

});

app.get("/donors/:id/edit", async (req, res) => {

    let { id } = req.params;

    const donor = await Donor.findById(id);

    res.render("edit", { donor });

});
app.put("/donors/:id", async (req, res) => {

    let { id } = req.params;

    await Donor.findByIdAndUpdate(id, req.body);

    res.redirect("/");

});

// SERVER
app.listen(8080, () => {

    console.log("Server Started");

});