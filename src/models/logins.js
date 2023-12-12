const { model, Schema } = require("mongoose");

const { formatDate } = require("../utils/utils");

const LoginsSchema = new Schema({
  day: {
    type: String,
    default: formatDate(new Date()),
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Logins", LoginsSchema);
