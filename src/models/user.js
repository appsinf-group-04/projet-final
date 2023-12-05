const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilPicture: String,
  phone: {
    type: String,
    required: true,
  },
  ranking: {
    type: [Number],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ban: {
    reason: String,
    at: Date,
    banned: Boolean,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },
});

module.exports = model("User", userSchema);
