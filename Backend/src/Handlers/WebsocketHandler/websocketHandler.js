const { sendError, sendResponse } = require("../../Utils/response");
const connectToDatabase = require("../../Database/db");
const Connections = require("../../Models/Connections");

const joinChat = async (pageId, connectionId) => {
  try {
    const db = await connectToDatabase();
    console.log("Hello");
    const newConnection = new Connections({
      pageId: pageId,
      connectionId: connectionId,
    });
    console.log(newConnection);
    const savedConnection = await newConnection.save();
    console.log("New connection saved");
  } catch (err) {
    return sendError(400, err);
  }
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { connectionId, eventType } = event.requestContext;

  if (eventType === "CONNECT") {
    console.log(`New connection : ${connectionId}`);
  } else {
    const payload = JSON.parse(event.body);
    if (payload) {
      switch (payload.action) {
        case "join-chat":
          await joinChat(payload?.pageId, connectionId);
          break;

        default:
          break;
      }
    }
  }
  return sendResponse({ message: "Hello from lambda function" });
};
