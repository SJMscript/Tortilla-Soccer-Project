const { Schema, model } = require("mongoose");

const top11PlayerSchema = new Schema(

 {
     creator: {
         type: Schema.Types.ObjectId,
         ref: "User"
     },
    position: {
        type: String,
        required: true,
        trim: true,
        enum: ["goalkeeper", "defense", "midfielder", "forward"]
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player"
    }

}
);

const Top11Player = model("Top11Player", top11PlayerSchema);

module.exports = Top11Player;
