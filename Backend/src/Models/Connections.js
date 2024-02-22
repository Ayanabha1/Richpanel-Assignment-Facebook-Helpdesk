const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionSchema = new Schema({
  userId: {
    type: String,
    require: true,
  },
  connectionId: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = mongoose.model("socket_connections", ConnectionSchema);
