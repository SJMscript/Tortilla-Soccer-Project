const router = require("express").Router();

const Player = require("../models/Player.model");
const Commet = require("../models/Comment.model");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated")
let playersArray = require("../utils/players.json")

//* GET "/players" => render list of players
router.get("/list", isAuthenticated, async (req, res, next) => {
    try{
        // Find and render all characters
        const players = await Player.find();
        // Clone the returned array because MongoDB returns a special array.
        /* const cloneArr = JSON.parse(JSON.stringify(players)); */
        
      res.json("list of players found");
    } catch (err) {
      console.log(err);
    }
  });

  // GET "/players/new-player" => render form to create a new player:

router.get("/new-player", isAuthenticated,  async (req, res, next) => {

    try{
        res.json("Aqui visualiza form para agregar")

    } catch(e){
        next(e);
    }
    /* const { skillfulLeg } = playersArray */
       /* currentTeam: currentTeamArray, */
       /* skillfulLeg: skillfulLegArray */
})


// POST "/players/new-player" => create a new player
// Note the middleware (uploader function) as an argument for the router, using the "image" property.
router.post("/new-player", async (req, res, next) => {
    console.log("req body post new-player", req.body)
    const {name, currentTeam, marketValue, age, image, skillfulLeg} = req.body;
    // Cloudinary will return the url on the req.file:
    /* console.log(req.file); */
    // Create a handler for the case when the image is not passed:
    
    //* Server validation:
    // Check the fields are not empty (or that req.file is undefined):
    if (!name || !currentTeam || !marketValue || !age || !skillfulLeg || !image ) {
        // If any field is empty, render the same page but with an error:
        res.status(400).json({errorMesage: "All fields are mandatory"})
        // We also need to stop the route:
        return;
    }

    // Asynchronous validations:
    try {
        /* let lowercaseName = name.toLowerCase(); */
        // Check if the player´s name already exists:
        const foundPlayer = await Player.findOne({name: lowercaseName})
        if (foundPlayer !== null) {
            res.status(400).json({errorMesage: "Player already exists"})
            return;
        }
    } catch (error) {
        next(error)
    }

    //* create a new character
    Player.create({
        name,
        age,
        currentTeam,
        marketValue,
        skillfulLeg,
        image,
        // For the image we will add the path of what cloudinary returns:
        /* image: req.file.path,
        creator: req.session.user._id */
    })
    .then(()=>{
        // If successfully created, we will redirect to the list of characters:
        res.redirect("/players")
    })
    .catch((error)=>{
        next(error)
    })
})




module.exports = router;