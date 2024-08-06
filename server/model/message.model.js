// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
const User = require("./user.model");
const messageSchema = new mongoose.Schema(
  {
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },

    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
