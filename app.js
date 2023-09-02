require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    try {
        await newUser.save();
        res.render("secrets");
    }catch(err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password =  req.body.password;
   
    const foundUser = await User.findOne({email: username}).exec();
    if(foundUser) {
        console.log(foundUser.password);
        if(foundUser.password === password) {
            res.render("secrets");
        }else{
            console.log("Incorrect Password");
        }
    }else {
        console.log("Username doesn't exists");
    }
});

app.listen(port, (req, res) => {
    console.log(`Server is listening on port ${port}`);
});
