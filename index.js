const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv =require("dotenv");

const a = express();
dotenv.config();

const port = process.env.PORT||5500;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.plq4p1b.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser : true,
    useUnifiedTopology: true
});

//registration_schema
const registrationSchema = new mongoose.Schema({
    email : String,
    password: String
});

const reg = mongoose.model("reg", registrationSchema);

a.use(bodyParser.urlencoded({extended:true}));
a.use(bodyParser.json());

a.get("/",(req,res)=>{
    res.sendFile(__dirname+ "/pages/index.html");
})

a.post("/register", async (req,res) =>{
try {
    const{email,password} = req.body;

    const existingUser = await reg.findOne({email:email});
    //check for existing user
    if(!existingUser){
        const registrationData = new reg({
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    else{
        console.log("User already exist.");
        res.redirect("/error");
    }
   
    } catch(error) {
    console.log(error);
    res.redirect("/error");
    }
})

a.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

a.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

a.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})