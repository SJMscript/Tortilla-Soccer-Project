const User = require("../models/User.model");

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const isAuthenticated = require("../middlewares/isAuthenticated")


//* POST "/api/auth/signup" --> para registrar usuarios
router.post("/signup", async (req, res, next) => {
    console.log(req.body);

    const { username, password, imageUrl, email} = req.body

    //* validaciones de servidor
    if (!username || !password || !email){
        res.status(400).json({errorMesage: "All fields are required"})
        return;
    }
 
    //* si el user ya está registrado
    try{
        const foundUser = await User.findOne({username: username, email: email});
        if(foundUser){
            res.status(400).json({errorMesage: "User already exists"})
        return; //todo probar luego
        
    }

            // Password validation
            const regexPassword =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
            if (regexPassword.test(password) === false) {
            res.status(400).json({errorMessage:
            "Password must be at least 8 characters long and contain at least one number and one letter (valid characters are A-Z, a-z, 0-9)",
            });
            return;
            }             



            //* encrypt password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            console.log(hashPassword)

            await User.create({username: username, email: email, password: hashPassword, imageUrl: imageUrl})

            res.json("User created successfully")

    } catch(e){
        next(e);
    }
})


//* POST "/api/auth/login" --> para validar credenciales de usuario
router.post("/login", async (req, res, next) => {
    console.log(req.body)

    const {email, password} = req.body

    //* validaciones del login como que los campos esten llenos
    try{
        //* user exists
        const foundUser = await User.findOne({ email: email})
        if(!foundUser){
            res.status(400).json({errorMesage: "User email not found"})
        return;
        }

        //* que la contraseña sea valida
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
        if(!isPasswordCorrect){
            res.status(400).json({errorMesage: "Wrong Password"})
        return;
        }
        // Token
        const payload = {
            _id: foundUser._id,
            email: foundUser.email,
            //! Poner roles (info)
        }

        const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: "HS256", expiresIn: "1d"}
        )



        res.json({authToken: authToken})
    }catch (e){
        next(e);
    }



})


//* GET "/api/auth/verify" --> para indicarle al FE si el user esta loggedin
router.get("/verify", isAuthenticated, (req, res, next) => {
    
    // 1. Recibir y validar el toker (middleware)
    // 2. Extraer el payload para indicar al FrontEnd quien es el usuario de ese token

    // Cuando usemos el middleware isAuthenticated tendremos acceso a saber QUIEN es el usuario haciendo la llamada (req.session.user)

    console.log( req.payload ) // usuario activo

    res.json({ payload: req.payload })

})


module.exports = router