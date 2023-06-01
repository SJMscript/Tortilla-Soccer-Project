const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes.js"))

// require our auth routes files:
const authRouter = require("./auth.routes.js")
// and use them:
router.use("/auth", authRouter)

// require our characters routes files:
const playersRouter = require("./players.routes.js")
// and use them:
router.use("/players", playersRouter)

module.exports = router; 