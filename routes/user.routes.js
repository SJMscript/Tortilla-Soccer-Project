const router = require("express").Router();
const User = require("../models/User.model")
const isAuthenticated = require("../middlewares/isAuthenticated")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

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


// PUT "user/profile/edit" 
router.put("/profile/edit", isAuthenticated, async (req, res, next) => {
    
    const  userId  = req.payload._id
    try {
        
        const { username, email, oldPassword, newPassword, profileImg } = req.body 
        const userProfile = await User.findById(userId)


        // Old password Check
        const sameOldPassword = await bcrypt.compare(oldPassword, userProfile.password)
        if ( !sameOldPassword ) {
            res.status(400).json({ errorMesage: "Not the same  Password" })
            return
        }

        // New password encrypt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update User Profile
        await User.findByIdAndUpdate(userId, {
            username,
            password: hashedPassword,
            email,
            profileImg
        })
        res.json("User Update")


    } catch (error) {
        next(error)
    }


})


module.exports = router