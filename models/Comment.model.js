const { Schema, model } = require("mongoose");


const commentSchema = new Schema(

 {
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
    }
}
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;