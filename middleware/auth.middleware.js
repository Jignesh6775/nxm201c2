const jwt = require("jsonwebtoken")
require("dotenv").config()
const {UserModel}= require("../model/user.model")

const auth = async(req,res, next)=>{
    try {
        const token = req.headers.authorization

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decodedToken)
        const { userId } = decodedToken

        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(401).json({message: "Unauthorized"})
        }
        req.user = user
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({message: "Unauthorized", err: err.message})
    }
}

module.exports = { auth }