import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer } from "ws";
import handleConnection from "./websockets/handleConnection.js";
import jwt from "jsonwebtoken";
import { prismaForWebsockets } from "./websockets/globals.js";
import { WorkspaceUserPermission } from "./src/lib/generated/prisma/index.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

async function verifyAuthToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId =
      decoded && typeof decoded === "object" ? decoded.userId : null;

    if (!userId) return null;

    // Verify user exists in database
    const user = await prismaForWebsockets.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user ? userId : null;
  } catch (err) {
    console.error("Error verifying token:", err);
    return null;
  }
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (request, socket, head) => {
    const { pathname, query } = parse(request.url, true);

    if (pathname === "/api/websocket") {
      const token = request.headers.cookie
        ?.split("; ")
        ?.find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      // Verify the token and get userId
      const userId = await verifyAuthToken(token);

      // If no valid user, close the connection
      if (!userId) {
        console.error("WebSocket authentication failed");
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      const fileId = query.fileId;

      // Check if file exists and user has permission to access it
      if (fileId) {
        try {
          const file = await prismaForWebsockets.file.findFirst({
            where: {
              id: fileId,
              Workspace: {
                users: {
                  some: {
                    userId: userId,
                    permissions: {
                      hasSome: [WorkspaceUserPermission.EDIT],
                    },
                  },
                },
              },
            },
          });

          if (!file) {
            console.error(`User ${userId} has no access to file ${fileId}`);
            socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
            socket.destroy();
            return;
          }
        } catch (err) {
          console.error("Error checking file access:", err);
          socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
          socket.destroy();
          return;
        }
      } else {
        socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
        socket.destroy();
        return;
      }

      // If everything is valid, handle the upgrade
      wss.handleUpgrade(request, socket, head, (ws) => {
        console.log(
          `WebSocket connection established for user ${userId} on file ${fileId}`
        );
        wss.emit("connection", ws, fileId, userId);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", handleConnection);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
