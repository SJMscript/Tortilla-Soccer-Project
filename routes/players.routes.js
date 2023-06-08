const router = require("express").Router();

const Player = require("../models/Player.model");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");

const uploader = require("../middlewares/uploader");

const isAuthenticated = require("../middlewares/isAuthenticated");
let playersArray = require("../utils/players.json");
const jwt = require("jsonwebtoken")

//* GET "/players" => render list of players
router.get("/list", isAuthenticated, async (req, res, next) => {
  try {
    // Find and render all characters
    const players = await Player.find();
    console.log(players);
    res.json(players);
  } catch (err) {
    console.log(err);
  }
});

// GET "/players/new-player" => render form to create a new player:

router.get("/new-player", isAuthenticated, async (req, res, next) => {
  try {
    res.json("Aqui visualiza form para agregar");
  } catch (e) {
    next(e);
  }
});

// POST "/players/new-player" => create a new player
// Note the middleware (uploader function) as an argument for the router, using the "image" property.
router.post("/new-player", isAuthenticated, uploader.single("imageUrl"), async (req, res, next) => {
  console.log("req body post new-player", req.body);
  const { name, currentTeam, marketValue, age, skillfulLeg, imageUrl, playerPosition } = req.body;
  // const { imageUrl } = req.file
  //console.log(req.file, "hola")


  // Server validation:
  // Check the fields are not empty (or that req.file is undefined):
  if (!name || !currentTeam || !marketValue || !age || !skillfulLeg || !imageUrl || !playerPosition) {
    // If any field is empty, render the same page but with an error:
    res.status(400).json({ errorMesage: "All fields are mandatory" });
    // We also need to stop the route:
    return;
  }

  // Asynchronous validations:
  try {
     //let lowercaseName = name.toLowerCase(); 
    // Check if the player´s name already exists:
    const foundPlayer = await Player.findOne({name: name});
     if (foundPlayer) {
      res.status(400).json({ errorMesage: "Player already exists" });
      return;
    } 

    // create a new player
    const patata = await Player.create({
      name,
      age,
      currentTeam,
      marketValue,
      skillfulLeg,
      playerPosition,
      imageUrl,
      creator: req.payload._id
    });
    console.log(patata);
    res.json("Player created successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET "/players/:playerId/edit-player" => show form to update player details by its ID:
router.get("/:playerId/edit-player", async (req, res, next) => {
  try {
    // Let's find the player by its id and render:
    const singlePlayer = await Player.findById(req.params.playerId);
    console.log(req.params.playerId);
    res.json("edit form");
  } catch (err) {
    next(err);
  }
});

// PUT "/players/:playerId/edit-player" => update player details by its ID:
router.put("/:playerId/edit-player", async (req, res, next) => {
  const { name, currentTeam, marketValue, age, skillfulLeg, imageUrl, playerPosition } = req.body;
    const { playerId } = req.params
  if (!name || !currentTeam || !marketValue || !age || !skillfulLeg || !imageUrl || !playerPosition) {
    res.status(400).json({ errorMesage: "All fields are mandatory" });
    return;
  }

  try{
    const foundAndUpdate = await Player.findByIdAndUpdate(playerId, {
        name,
        age,
        currentTeam,
        marketValue,
        skillfulLeg,
        playerPosition,
        imageUrl
    })
    console.log("player id", playerId)
    res.json("Player updated")

  } catch(err){
    next(err);
  }

})

//* GET "/players/:playerId/details" => Render specific player by ID: 
router.get("/:playerId/details", isAuthenticated, async (req, res, next) => {

  

    try {
      // Find the character that matches the id sent by the params:
      const singlePlayer = await Player.findById(req.params.playerId);

      console.log(req.params.playerId)
      res.json( singlePlayer )


    } catch (err) {
      next(err);
    }
  });

  // POST "/players/:playerId/details" => Get info from comment text area and render the page with new comment:
router.post("/:playerId/details",isAuthenticated, async (req, res, next) => {
  console.log("Qué trae?",req.body, req.params.playerId)
  console.log(req.payload, "PAYLOAD A CHECKEAR")
    // Create new comment with req.payload._id as creator, req.body.comment as content and req.params.playerId as character:
    try{
       const userId = req.payload._id 
       const playerParamsId = req.params.playerId
       await Comment.create({
          creator: userId, 
          content: req.body.content,
          player: playerParamsId
      })

      res.json("Comentario creado"/* `/players/${req.params.playerId}/details` */)
    }catch(err){
      next(err);
    }
})


// DELETE "/comments/:commentId" => Eliminar un comentario por su ID
router.delete("/comments/:commentId", isAuthenticated, async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.payload._id;

    // Buscar el comentario por su ID
    const comment = await Comment.findById(commentId);

    // Verificar si el comentario existe y si el creador del comentario coincide con el usuario autenticado
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.creator.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    // Eliminar el comentario
    await Comment.findByIdAndDelete(commentId);
    res.json("Comment deleted");
  } catch (err) {
    next(err);
  }
});



// GET "/players/:playerId/comments" => Get comments for a specific player
router.get("/:playerId/comments", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id 
    const comments = await Comment.find({ player: req.params.playerId }) //!Chequear esta lógica también
      .populate("creator", "username") // Populate the creator field with the username
      .select("content creator")

    res.json(comments); //! tengo que pasar userId Como creator?
  } catch (err) {
    next(err);
  }
});


//* DELETE "players/:playerId/delete" => delete a player by its Id
router.delete("/:playerId/delete", async (req, res, next) => {
  const { playerId } = req.params
    try {
      // Let's find the player by its Id and delete it:
      await Player.findByIdAndDelete(playerId);
      res.json("Player deleted!");
    } catch (err) {
      next(err);
    }
  });

  //POST "/:playerId/like" => recoge los datos del me gusta para añadirlo a la array de like de User
router.post("/:playerId/like", isAuthenticated, async (req, res, next) => {
  try {
    
    const playerId = req.params.playerId;
    const userId = req.payload._id
    const playersLike = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { likedPlayers: playerId } },
      { new: true }
    );
    console.log("params", req.params.playerId)
   
    res.json(
      playersLike
    );
  } catch (error) {
    next(error);
  }
});

//POST "/:playerId/unLike" 
router.post("/:playerId/unLike", isAuthenticated, async (req, res, next) => {
  try {
    
    const playerId = req.params.playerId;
    const userId = req.payload._id
    const playersUnLike = await User.findByIdAndUpdate(
      userId,
      { $pull: { likedPlayers: playerId } },
      { new: true }
    );
      res.json(playersUnLike)
  } catch (error) {
    next(error)
  }
})


module.exports = router;
