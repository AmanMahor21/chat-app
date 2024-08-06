const Conversation = require("../model/conversation.model");
const Message = require("../model/message.model");
const { activeIds, io, clickedUser } = require("../utils/socketIo");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverID = req.params.id;
    const senderID = req.user._id;

    // console.log(clickedUser, "clickedUser clickedUser");
    let one_On_One = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    });

    if (!one_On_One) {
      one_On_One = await Conversation.create({
        participants: [senderID, receiverID],
      });
    }
    const newMessage = await Message.create({
      senderID,
      receiverID,
      message,
    });
    if (newMessage) {
      one_On_One.message.push(newMessage._id);
    }
    await one_On_One.save();

    await res.status(200).json(newMessage);
    const activeUser = activeIds(receiverID);
    console.log(activeUser);
    if (activeUser) {
      io.to(activeUser).emit("textSend", newMessage);
    }

    // console.log(senderID);
  } catch (error) {
    console.log("Error in send Message controller");
    res.status(500).json({ error, error: "Internal Server Error" });
  }
};

const receiveMessage = async (req, res) => {
  try {
    const senderID = req.user._id;
    // console.log(senderID);
    const receiverID = req.params.id;

    let collect_Message = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    }).populate("message");

    if (!collect_Message) {
      return res.status(200).json([]);
    }
    // await collect_Message.save();
    // console.log(collect_Message.message, "collect_Message collect_Message");
    return await res.status(200).json(collect_Message.message);

    // console.log(senderID, receiverID);
  } catch (error) {
    console.log("Error in receiveMessage controller");
    res.status(500).json({ error, error: "Internal Server Error" });
  }
};

const allMessages = async (req, res) => {
  try {
    const totalMessage = await Message.find();
    if (!totalMessage || totalMessage.length === 0) {
      return await res.status(200).json([]);
    }
    console.log(totalMessage);
    return await res.status(200).json(totalMessage);
  } catch (error) {
    console.log("Error in allMessages controller");
    res.status(500).json({ error, error: "Internal Server Error" });
  }
};

module.exports = { sendMessage, receiveMessage, allMessages };
