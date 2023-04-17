const express = require("express")
const blogRouter = express.Router()
const {BlogModel} = require("../model/blog.model")
const jwt = require("jsonwebtoken")
const {authRole} = require("../middleware/authRole.middleware")
require("dotenv").config()


blogRouter.get("/", authRole(["User", "Moderator"]) , async (req, res) =>{
    const {token} = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const data = await BlogModel.find({"userId": decoded.userId})
        res.status(200).send(data)
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }
})

blogRouter.get("/:id", authRole(["User"]) ,async(req,res)=>{
    const {id} = req.params.id
    try {
        const data = await BlogModel.findOne({_id: id})
        res.status(200).send(data)
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }
})

blogRouter.post("/add", authRole(["User", "Moderator"]) , async(req, res)=>{
    try {
        const data = new BlogModel(req.body)
        await data.save()
        res.status(200).send({ "msg": "A new User Added" })
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }
})

blogRouter.delete("/delete/:id",authRole(["User"]) , async(req, res)=>{
    const {id} = req.params.id
    try {
        await BlogModel.findByIdAndDelete({_id: id})
        res.status(200).send({ "msg": "A User Deleted" })
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }
})

blogRouter.delete("/deleteByModerator/:id",authRole(["Moderator"]) , async(req, res)=>{
    const {id} = req.params.id
    try {
        await BlogModel.findByIdAndDelete({_id: id})
        res.status(200).send({ "msg": "A User Deleted by Moderator" })
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }
})

blogRouter.patch("/update/:id", authRole(["User"]) , async(req, res)=>{
    const {id} = req.params.id
    const payload = req.body
    try {
        await BlogModel.findByIdAndUpdate({_id: id}, payload)
        res.status(200).send({ "msg": "A User Updated" })
    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }
})


module.exports = { blogRouter }