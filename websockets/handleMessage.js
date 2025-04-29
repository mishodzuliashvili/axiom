import {
  fileOperationVersion,
  fileConnections,
  fileLeader,
  prismaForWebsockets,
} from "./globals.js";

export default async function handleMessage(data, ws, fileId, userId) {
  const messageStr = data.toString();
  const message = JSON.parse(messageStr);

  if (message.type === "content") {
    const enrichedMessage = {
      ...message,
      time: new Date().toISOString(),
      fileId: fileId,
      userId: userId,
      version: fileOperationVersion[fileId]++,
    };

    fileConnections[fileId].forEach((conn) => {
      if (conn.ws.readyState === 1) {
        // TODO: lets test this like that, in future maybe we have to exclude the sender
        conn.ws.send(JSON.stringify(enrichedMessage));
      }
    });
    try {
      // TODO:Store operation in database for persistence and history
    } catch (dbErr) {
      console.error("Failed to store operation in database:", dbErr);
    }
  }

  if (message.type === "cursor") {
    const enrichedMessage = {
      ...message,
      time: new Date().toISOString(),
      fileId: fileId,
      userId: userId,
    };

    fileConnections[fileId].forEach((conn) => {
      if (conn.ws.readyState === 1) {
        // TODO: lets test this like that, in future maybe we have to exclude the sender
        conn.ws.send(JSON.stringify(enrichedMessage));
      }
    });
  }
}
