const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const dotenv = require('dotenv').config()
const mongoose = require("mongoose")
const cors = require('cors')
const User = require('./user.js')
const {hashPass, comparePass } = require('./auth.js')
const jwt = require('jsonwebtoken')

mongoose.connect(MONGO_URL = "mongodb+srv://bssarang6:HZpihfU20iibTSKq@login.7n3opsq.mongodb.net/?retryWrites=true&w=majority&appName=Login")
.then(() => console.log("Connected to Database"))
.catch((err) => console.log("Database not Connected ", err))

const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'Images')
    },
    filename: (req, file, cb)=>{
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }  
})

const upload = multer({storage: storage})
app.use(express.json())
app.use(express.static('views'));
app.set('view engine', 'ejs')

app.get("/", (req,res)=>{
    res.render("home")
})
app.get("/upload", (req,res)=>{
    res.render("upload")
})

app.get("/login", (req, res)=>{
    res.render("login")
})

app.get("/signup", (req,res)=>{
    res.render("signup")
})

app.post("/login", async (req,res)=>{
    try{
        const {name, password} = req.body
        // Check if user exists
        const user = await User.findOne({name});
        if (!user){
            res.status(401).send('User Not Found');
            res.redirect()
        }

        const match = await comparePass(password, user.password)
        if(match){
            jwt.sign(
                { name: user.name, id: user._id, email: user.email },
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                  if (err) throw err;
                  console.log(token);
                  res.render('upload')
                }
            );
        }
        if(!match){
            res.status(401).send("Passwords dont match")
            res.render("login")
        }
        return match
    }
    catch(error){
        console.log(error)
    }
})

app.post("/signup", async(req,res)=>{
    try {
        const {name, email, password} = req.body;
        // checking
        if(!name){
            res.status(401).send('Login unsuccessful. Please check your name and password.');
            res.render('signup')
        }
        if(!password || password.length < 6){
            res.status(401).send('Login unsuccessful. Please check your name and password.');
            res.render('signup')
        }
        const exist = await User.findOne({email})
        if(exist){
            res.status(401).send('Login unsuccessful. Check your email.');
            res.render('signup')
        }
        const hashedPassword = await hashPass(password)
        const user = await User.create({
            name,email,
            password: hashedPassword
        })

        res.render("upload")
    } catch (error) {
        console.log(error)
    }
})
app.post("/upload", upload.single('image'), (req,res)=>{
    res.send("Uploaded Successfully")
})

app.listen(3001)

console.log("3001 is the port")