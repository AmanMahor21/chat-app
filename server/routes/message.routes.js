const express = require("express");
const router = express.Router();
const {
  sendMessage,
  receiveMessage,
  allMessages,
} = require("../controller/message.controller");
// const receiveMessage = require("../controller/message.controller");
const authRoute = require("../middleware/authRoute");

router.get("/", authRoute, allMessages);
router.get("/:id", authRoute, receiveMessage);
router.post("/send/:id", authRoute, sendMessage);

module.exports = router;
