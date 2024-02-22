const connectToDatabase = require("../../Database/db");
const Connections = require("../../Models/Connections");
const userModel = require("../../Models/User");
const { sendError, sendResponse } = require("../../Utils/response");
const endpoint = process.env.AWS_API_ENDPOINT;
const AWS = require("aws-sdk");

const gatewayClient = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint,
});

const sendToConnection = async (payload) => {
  try {
    const db = await connectToDatabase();
    const connectionId = await Connections.find({ userId: payload?.sender?.id })
      .sort({ _id: -1 })
      .limit(1);
    console.log(connectionId);
    return gatewayClient
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      })
      .promise();
  } catch (err) {
    return err;
  }
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const body = JSON.parse(event.body);

    if (
      body.object === "page" &&
      body.entry &&
      body.entry.length > 0 &&
      body.entry[0].messaging
    ) {
      await body.entry.forEach(async (entry) => {
        await entry.messaging.forEach(async (event) => {
          if (event.message) {
            const senderId = event.sender.id;
            const messageText = event.message.text;

            const payload = {
              sender: {
                id: senderId,
              },
              message: messageText,
            };
            await sendToConnection(payload);
          }
        });
      });
    }

    console.log("WEBHOOK CALLED");
    return sendResponse({
      message: "success!",
    });
  } catch (error) {
    return sendError(error?.statusCode, error);
  }
};
