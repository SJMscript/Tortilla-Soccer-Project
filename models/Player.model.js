const { Schema, model } = require("mongoose");

const playerSchema = new Schema(
 {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    currentTeam: {
        type: String,
        required: true,
/*          enum: ["Real Madrid", "Barcelona", "Valencia", "Chelsea FC"] */
    },
    marketValue: {
        type: Number,
        required: true
   },
    age: {
        type: Number,
        required: true
    },
    skillfulLeg: {
        type: String,
        required: true,
        enum: ["Right", "Left"]
    },
    imageUrl : String,
    creator:{
        type: Schema.Types.ObjectId,
        ref: "User"     
    }
    
}
);

const Player = model("Player", playerSchema);

module.exports = Player 