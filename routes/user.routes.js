const router = require("express").Router();
const User = require("../models/User.model")
const isAuthenticated = require("../middlewares/isAuthenticated")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

router.get("/profile", isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
  
    try {
      const userProfile = await User.findById(userId).populate("likedPlayers");
  
      if (userProfile.profileImg) {
        res.json(userProfile);
      } else {
        res.json(userProfile);
      }
    } catch (error) {
      next(error);
    }
  });



// PUT "user/profile/edit" 
router.put("/profile/edit", isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    const { username, email, oldPassword, newPassword, profileImg } = req.body;

    try {
        const userProfile = await User.findById(userId);

        // Verificar la contraseña anterior
        const sameOldPassword = await bcrypt.compare(oldPassword, userProfile.password);
        if (!sameOldPassword) {
            res.status(400).json({ errorMessage: "Not the same password" });
            return;
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar el perfil del usuario
        await User.findByIdAndUpdate(userId, {
            username,
            password: hashedPassword,
            email,
            profileImg
        })

        await userProfile.save(); // Guardar los cambios en el perfil del usuario

        res.json("User updated");
    } catch (error) {
        next(error);
    }
});

router.get("/role", isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
  
    try {
      const user = await User.findById(userId);
      const role = user.role;
  
      res.json({ role });
    } catch (error) {
      next(error);
    }
  });

 module.exports = router