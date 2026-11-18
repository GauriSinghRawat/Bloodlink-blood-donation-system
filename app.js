
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const dotenv = require("dotenv");



dotenv.config();
const Donor = require("./models/donor");
mongoose.connect(process.env.MONGODB_URI);
console.log("MongoDB URI loaded:", !!process.env.MONGODB_URI);
const app = express();

// VIEW ENGINE
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));

// HOME ROUTE
app.get("/", async (req, res) => {
    const donors = await Donor.find({});
    res.render("index", { donors });
});

// SEARCH ROUTE
app.get("/search", async (req, res) => {
    const blood = req.query.bloodGroup;

    const donors = blood
        ? await Donor.find({ bloodGroup: blood })
        : await Donor.find({});

    res.render("index", { donors });
});

// NEW DONOR FORM
app.get("/donors/new", (req, res) => {
    res.render("new");
});

// CREATE DONOR
app.post("/donors", async (req, res) => {
    const donor = new Donor(req.body);
    await donor.save();
    res.redirect("/");
});

// DELETE DONOR
app.delete("/donors/:id", async (req, res) => {
    const { id } = req.params;

    await Donor.findByIdAndDelete(id);
    res.redirect("/");
});

// EDIT FORM
app.get("/donors/:id/edit", async (req, res) => {
    const { id } = req.params;

    const donor = await Donor.findById(id);
    res.render("edit", { donor });
});

// UPDATE DONOR
app.put("/donors/:id", async (req, res) => {
    const { id } = req.params;

    await Donor.findByIdAndUpdate(id, req.body);
    res.redirect("/");
});

// DATABASE CONNECTION + SERVER START
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected Successfully!");

        const PORT = process.env.PORT || 8000;

        app.listen(PORT, () => {
            console.log(`Server Started on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();



// const express = require("express");
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");

// const Donor = require("./models/donor");

// const app = express();


// // DATABASE CONNECTION
// mongoose.connect("mongodb://127.0.0.1:27017/bloodlink")
// .then(() => {
//     console.log("MongoDB Connected");
// })
// .catch((err) => {
//     console.log(err);
// });


// // VIEW ENGINE
// app.set("view engine", "ejs");


// // MIDDLEWARE
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static("public"));


// // HOME ROUTE
// app.get("/", async (req, res) => {

//     const donors = await Donor.find({});

//     res.render("index", { donors });

// });

// app.get("/search", async (req, res) => {

//     const blood = req.query.bloodGroup;

//     const donors = await Donor.find({
//         bloodGroup: blood
//     });

//     res.render("index", { donors });

// });

// // NEW FORM ROUTE
// app.get("/donors/new", (req, res) => {

//     res.render("new");

// });


// // CREATE ROUTE
// app.post("/donors", async (req, res) => {



//     const donor = new Donor(req.body);

//     await donor.save();

//     res.redirect("/");

// });

// app.delete("/donors/:id", async (req, res) => {

//     let { id } = req.params;

//     await Donor.findByIdAndDelete(id);

//     res.redirect("/");

// });

// app.get("/donors/:id/edit", async (req, res) => {

//     let { id } = req.params;

//     const donor = await Donor.findById(id);

//     res.render("edit", { donor });

// });
// app.put("/donors/:id", async (req, res) => {

//     let { id } = req.params;

//     await Donor.findByIdAndUpdate(id, req.body);

//     res.redirect("/");

// });

// // SERVER
// app.listen(8000, () => {

//     console.log("Server Started");

// });