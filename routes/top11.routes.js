
const router = require("express").Router();
const Player = require("../models/Player.model");
const Top11Player = require("../models/Top11Player.model");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

// GET "/createTop11"
router.get("/createTop11", isAuthenticated, async (req, res, next) => {

    const userId = req.payload._id

    try {
        const allPlayers = await Top11Player.find({
          creator: userId
        }).populate("player");
        res.json(allPlayers);
    } catch (error) {
        next(error);
    }
});


// POST "/top11/createTop11"
router.post("/createTop11", isAuthenticated, async (req, res, next) => {
    const { player, position } = req.body;

    try {
        const allPlayers = await Top11Player.find();
        const playerCount = allPlayers.length;

        if (playerCount >= 11) {
            return res.status(400).json({ error: "Your team has reached 11 players" });
        }

        let maxGoalkeepers = 1;
        let maxDefenses = 5;
        let maxMidfielders = 4;
        let maxForwards = 3;

        let currentPositionCount = 0;
        let isPlayerInTeam = false;

        for (let i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i].position === position) {
                currentPositionCount++;
            }

            if (allPlayers[i].player.toString() === player) {
                isPlayerInTeam = true;
                break;
            }
        }

        if (isPlayerInTeam) {
            return res.status(400).json({ error: "The player is already in the team" });
        }

        if (position === "goalkeeper" && currentPositionCount >= maxGoalkeepers) {
            return res.status(400).json({ error: "The maximum number of goalkeepers has been reached" });
        }

        if (position === "defense" && currentPositionCount >= maxDefenses) {
            return res.status(400).json({ error: "The maximum number of defenders has been reached" });
        }

        if (position === "midfielder" && currentPositionCount >= maxMidfielders) {
            return res.status(400).json({ error: "The maximum number of midfielders has been reached" });
        }

        if (position === "forward" && currentPositionCount >= maxForwards) {
            return res.status(400).json({ error: "The maximum number of forwards has been reached" });
        }

        // Crear el jugador en el equipo
        const chooseYourPlayer = await Top11Player.create({
            player: player,
            position: position,
            creator: req.payload._id
        });

        // Actualizar el array de top11 del usuario
        //console.log(req.payload, "que trae payload")
        const user = await User.findOneAndUpdate(
            { _id: req.payload._id },
            { $addToSet: { top11: chooseYourPlayer._id } },
            { new: true }
        );

        

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(chooseYourPlayer);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

/* const router = require("express").Router();
const Player = require("../models/Player.model");
const Top11Player = require("../models/Top11Player.model");
const User = require("../models/User.model");

// GET "/createTop11"
router.get("/createTop11", async (req, res, next) => {
  try {
    const allPlayers = await Player.find();
    res.json(allPlayers);
  } catch (error) {
    next(error);
  }
});

// POST "/createTop11"
router.post("/createTop11", async (req, res, next) => {
  const { player, position } = req.body;

  try {
    const allPlayers = await Top11Player.find();
    const playerCount = allPlayers.length;

    if (playerCount >= 11) {
      return res.status(400).json({ error: "Your team has reached 11 players" });
    }

    let maxGoalkeepers = 1;
    let maxDefenses = 5;
    let maxMidfielders = 4;
    let maxForwards = 3;

    let currentPositionCount = 0;
    let isPlayerInTeam = false;

    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].position === position) {
        currentPositionCount++;
      }

      if (allPlayers[i].player.toString() === player) {
        isPlayerInTeam = true;
        break;
      }
    }

    if (isPlayerInTeam) {
      return res.status(400).json({ error: "The player is already in the team" });
    }

    switch (position) {
      case "goalkeeper":
        if (currentPositionCount >= maxGoalkeepers) {
          return res.status(400).json({ error: "The maximum number of goalkeepers has been reached" });
        }
        break;
      case "defense":
        if (currentPositionCount >= maxDefenses) {
          return res.status(400).json({ error: "The maximum number of defenders has been reached" });
        }
        break;
      case "midfielder":
        if (currentPositionCount >= maxMidfielders) {
          return res.status(400).json({ error: "The maximum number of midfielders has been reached" });
        }
        break;
      case "forward":
        if (currentPositionCount >= maxForwards) {
          return res.status(400).json({ error: "The maximum number of forwards has been reached" });
        }
        break;
      default:
        return res.status(400).json({ error: "Invalid position" });
    }

    const newTop11Player = await Top11Player.create({ player, position });
    res.json(newTop11Player);
  } catch (error) {
    next(error);
  }
});

module.exports = router; */
