const router = require("express").Router();
const User = require("../models/User.model")
const isAuthenticated = require("../middlewares/isAuthenticated")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

// GET "user/profile" 
/* router.get("/profile", isAuthenticated, async (req, res, next) => {

    const userId = req.payload._id

    try {
        const userProfile = await User.findById(userId)
        res.json(userProfile)
    } catch (error) {
        next(error)
    }

}) */

// router.get("/profile", isAuthenticated, async (req, res, next) => {
//     const userId = req.payload._id;
  
//     try {
//       const userProfile = await User.findById(userId).populate("likedPlayers");
//       res.json(userProfile);
//     } catch (error) {
//       next(error);
//     }
//   });
router.get("/profile", isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;

    try {
        const userProfile = await User.findById(userId).populate("likedPlayers");

        // Si la propiedad profileImg existe en el perfil del usuario,
        // no se necesita generar la URL completa del servidor,
        // ya que la imagen proviene de Cloudinary
        if (userProfile.profileImg) {
            // Aquí userProfile.profileImg es la referencia o URL de la imagen en Cloudinary
            // Puedes utilizar directamente esta URL en el frontend para mostrar la imagen
            res.json(userProfile);
        } else {
            res.json(userProfile);
        }
    } catch (error) {
        next(error);
    }
});


// // PUT "user/profile/edit" 
// router.put("/profile/edit", isAuthenticated, async (req, res, next) => {
    
//     console.log(req.file)
//     const profileImg = req.file
//     const  userId  = req.payload._id
//     try {
        
//         const { username, email, oldPassword, newPassword } = req.body 
//         const userProfile = await User.findById(userId)


//         // Old password Check
//         const sameOldPassword = await bcrypt.compare(oldPassword, userProfile.password)
//         if ( !sameOldPassword ) {
//             res.status(400).json({ errorMesage: "Not the same  Password" })
//             return
//         }

//         // New password encrypt 
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         // Update User Profile
//         await User.findByIdAndUpdate(userId, {
//             username,
//             password: hashedPassword,
//             email,
//             profileImg
//         })
//         res.json("User Update")


//     } catch (error) {
//         next(error)
//     }


// })

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

 module.exports = router