const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes.js"))

/* // require our auth routes files:
const authRouter = require("./auth.routes.js")
 and use them:
router.use("/auth", authRouter) */

// require our characters routes files:
const playersRouter = require("./players.routes.js")
// and use them:
router.use("/players", playersRouter)

const userRouter = require("./user.routes.js")
router.use("/user", userRouter)

const top11Router = require("./top11.routes.js")
router.use("/top11", top11Router)

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

/* const infoRouter = require("./info.routes.js")
router.use("/info", infoRouter) */

module.exports = router; 