import {
  fileConnections,
  fileLeader,
  fileOperationVersion,
} from "./globals.js";

export default async function handleInit(ws, fileId, userId, canEdit) {
  const alreadyConnected =
    fileConnections[fileId] &&
    [...fileConnections[fileId]].some((conn) => conn.userId === userId);

  if (alreadyConnected) {
    return;
  }

  if (!fileConnections[fileId]) {
    fileOperationVersion[fileId] = 0;
    fileConnections[fileId] = new Set();
  }

  fileConnections[fileId].add({ ws, userId, canEdit }); // Store canEdit info

  // Make this user leader if they can edit AND there's no current leader who can edit
  if (canEdit && !fileLeader[fileId]) {
    fileLeader[fileId] = { ws, userId };
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ type: "you-are-leader", fileId }));
    }
  }

  const usersList = Array.from(fileConnections[fileId]).map(
    (conn) => conn.userId
  );

  fileConnections[fileId].forEach((conn) => {
    if (conn.ws.readyState === 1) {
      conn.ws.send(
        JSON.stringify({
          type: "users-list",
          fileId,
          usersList: usersList,
        })
      );
    }
  });
}
