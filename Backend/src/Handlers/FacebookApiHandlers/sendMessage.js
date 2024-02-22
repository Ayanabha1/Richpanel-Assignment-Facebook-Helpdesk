const connectToDatabase = require("../../Database/db");
const Message = require("../../Models/Message");
const { sendError, sendResponse } = require("../../Utils/response");

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const db = await connectToDatabase();
    const body = JSON.parse(event.body);

    const newMessage = new Message({
      psid: body?.sender?.id,
      name: body?.sender?.name,
      message: body?.message,
    });

    const savedMessage = await newMessage.save();

    return sendResponse({
      message: "Message saved in DB!",
    });
  } catch (error) {
    return sendError(error?.statusCode, error);
  }
};
