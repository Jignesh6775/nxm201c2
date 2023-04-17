const express = require("express")
const userRouter = express.Router()
const {UserModel} = require("../model/user.model")
const {BlacklistModel} = require("../model/blacklist.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const {auth} = require("../middleware/auth.middleware")


const app = express()

//Registration
userRouter.post("/register", async(req, res)=>{
    const {email, pass, role} = req.body
    try{
        //check user
        const userExists = await UserModel.findOne({ email })
        if(userExists){
            return res.status(400).json({ message : "User already exists" })
        }

        //create new user
        bcrypt.hash(pass, 5, async (err, hash) =>{
            const user = new UserModel({ email, pass: hash, role })
            await user.save()
            res.status(200).send({ "msg" : "User register successfully"})
        })
    } catch (err){
        res.status(400).send({ "msg" : err.message })
    }
})


//Login
userRouter.post("/login", async(req, res)=>{
    const {email, pass} = req.body
    try{
        //check user
        const user = await UserModel.findOne({ email })
        if(!user){
            return res.status(400).json({ message : "Invalid Username" })
        }

        //check password
        const passwordMatch = await bcrypt.compare(pass, user.pass)
        if(!passwordMatch){
            return res.status(400).json({ message : "Invalid Password" })
        }

        //create access token
        const accesstoken = jwt.sign({ email, userId: user._id, role:user.role }, process.env.JWT_SECRET, {
            expiresIn: "1m"
        })
        //create refreshtoken
        const refreshtoken = jwt.sign({ email, userId: user._id }, process.env.REFRESH_SECRET, {
            expiresIn: "3m"
        })

        res.json({ msg : "Login Successful", accesstoken, refreshtoken})
    } catch (err){
        res.status(400).send({ "msg" : err.message })
    }
})

//Logout
userRouter.get("/logout",auth, async(req, res)=>{
    try{
        const token = req?.headers?.authorization

        const blacklistToken = new BlacklistModel({token})
        console.log(blacklistToken)

        await blacklistToken.save()

        res.status(200).send("Logout successful")
    } catch (err){
        res.status(400).send({ "msg" : err.message })
    }
})

//new Token
userRouter.get("/getnewtoken", (req,res) =>{
    const refreshtoken = req.headers.authorization

    if(!refreshtoken) return res.send({ msg : "Please Login" })

    jwt.verify(refreshtoken, process.env.REFRESH_SECRET, (err, decoded) =>{
        if(err) return res.send({ msg : "Please Login Again" })
        else{
            const accesstoken = jwt.sign( {userId: decoded.userId, email: decoded.email }, process.env.JWT_SECRET, {expiresIn : "3m"} )
            res.status(200).send( {msg: "New token generated", accesstoken })
        }
    })
})

module.exports = { userRouter}