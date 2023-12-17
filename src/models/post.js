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
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  seller: {
    type: String,
    default: "Inconnu"
  },
  pictures: {
    type: [String],
    default: [],
  },
  ban: {
    reason: String,
    at: Date,
    banned: {
      type: Boolean,
      default: false
    },
  },
  sold: {
    type: Boolean,
    default: false,
  },
  interested: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

module.exports = model("Post", postSchema);
