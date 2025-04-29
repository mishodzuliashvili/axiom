import handleInit from "./handleInit.js";
import handleMessage from "./handleMessage.js";
import handleClose from "./handleClose.js";

export default async function handleConnection(ws, fileId, userId) {
  try {
    await handleInit(ws, fileId, userId);
  } catch (err) {
    console.error("Error handling init:", err);
  }

  ws.on("message", async (data) => {
    try {
      await handleMessage(data, ws, fileId, userId);
    } catch (err) {
      console.error("Error handling message:", err);
    }
  });

  ws.on("close", async () => {
    try {
      await handleClose(ws, fileId, userId);
    } catch (err) {
      console.error("Error handling close:", err);
    }
  });
}
