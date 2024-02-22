const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  name: {
    type: String,
  },
  psid: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("messages", MessageSchema);
