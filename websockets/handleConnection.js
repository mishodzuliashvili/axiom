import handleInit from "./handleInit.js";
import handleMessage from "./handleMessage.js";
import handleClose from "./handleClose.js";

export default async function handleConnection(ws, fileId, userId, canEdit=false) {
  try {
    await handleInit(ws, fileId, userId, canEdit);
  } catch (err) {
    console.error("Error handling init:", err);
  }

  ws.on("message", async (data) => {
    try {
      if (!canEdit) {
        return;
      }

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
