import { PrismaClient } from "../src/lib/generated/prisma/index.js";

export const prismaForWebsockets = new PrismaClient();

// {
//     fileId: new Set({ ws, userId })
// }
export const fileConnections = {};
// {
//     fileId: fileOperationVersion as number
// }
export const fileOperationVersion = {};
// {
//     fileId: { ws, userId }
// }
// Leader becomes the first one that connected and if connection ends then we choose next random leader in fileConnections
export const fileLeader = {};
