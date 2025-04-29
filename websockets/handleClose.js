import { fileConnections, fileLeader, fileOperationVersion } from "./globals.js";

export default async function handleClose(ws, fileId, userId) {
  let wasLeader = false;
  if (fileConnections[fileId]) {
    fileConnections[fileId].forEach((conn) => {
      if (conn.ws === ws) {
        if (fileLeader[fileId] && fileLeader[fileId].ws === conn.ws) {
          wasLeader = true;
          delete fileLeader[fileId];
        }
        fileConnections[fileId].delete(conn);
      }
    });

    if (fileConnections[fileId].size === 0) {
      delete fileConnections[fileId];
    }
  }

  if (fileOperationVersion[fileId]) {
    delete fileOperationVersion[fileId];
  }

  if (
    wasLeader &&
    fileConnections[fileId] &&
    fileConnections[fileId].size > 0
  ) {
    const newLeader = Array.from(fileConnections[fileId])[0];
    fileLeader[fileId] = newLeader;
    if (newLeader.ws.readyState === 1) {
      newLeader.ws.send(JSON.stringify({ type: "you-are-leader", fileId }));
    }
  }

  if (fileConnections[fileId] && fileConnections[fileId].size > 0) {
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
}
