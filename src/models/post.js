const { model, Schema } = require("mongoose");

const postSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        default: "",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    refUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    pictures: {
        type: [String],
        default: [],
    },
    ban: {
        reason: String,
        at: Date,
        banned: Boolean,
    },
    sell: {
        type: Boolean,
        default: false,
    },
});

module.exports = model("Post", postSchema);