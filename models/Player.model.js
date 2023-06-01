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
        // enum: ["Real Madrid", "Barcelona", "Valencia"]
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
        enum: ["right", "left"]
    },
    imageUrl : String,
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"     
    }
    
}
);

const Player = model("Player", playerSchema);

module.exports = Player 