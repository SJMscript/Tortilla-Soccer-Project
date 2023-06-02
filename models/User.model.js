const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  
    {
      username: {
          type: String,
          required: true,
          unique: true,
          trim: true
      },
      email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true
      },
      password: {
          type: String,
          required: true
      },
      imageUrl: {
        String,
        // default: "images/default.jpg"
    },
      role: {
          type: String,
          enum: ["user", "moderator"],
          default: "user"
      },
       likedPlayers: [{
          type: Schema.Types.ObjectId,
          ref: "Player"
      }] 
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;