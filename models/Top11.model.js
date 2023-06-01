const { Schema, model } = require("mongoose");

const top11Schema = new Schema(

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

const Top11 = model("Top11", top11Schema);

module.exports = Top11;
