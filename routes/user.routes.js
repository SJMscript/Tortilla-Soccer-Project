const router = require("express").Router();
const User = require("../models/User.model")
const isAuthenticated = require("../middlewares/isAuthenticated")
const jwt = require("jsonwebtoken")

// GET "user/profile" 
router.get("/profile", isAuthenticated, async (req, res, next) => {

    const userId = req.payload._id

    try {
        const userProfile = await User.findById(userId)
        res.json(userProfile)
    } catch (error) {
        next(error)
    }

})



module.exports = router