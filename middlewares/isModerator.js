
function isModerator(req, res, next){
    console.log(req.payload, "Qué trae el payload en el middleware")
    if(req.payload.role === "moderator"){
        next()
    } else {
        res.status(403).json({ error: "You are not a moderator" });
    }
}

module.exports = {
    isModerator
}