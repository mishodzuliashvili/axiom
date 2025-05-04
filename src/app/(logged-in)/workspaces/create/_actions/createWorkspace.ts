"use server";
import { getUser } from "@/lib/auth";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import createServerAction from "@/lib/utils/createServerAction";
import { z } from "zod";

const createWorkspace = createServerAction(
  z.object({
    encryptedName: z.string().min(1),
    encryptedWorkspaceSecretKey: z.string().min(1),
  }),
  async ({ encryptedName, encryptedWorkspaceSecretKey }, prisma) => {
    const user = await getUser();
    if (!user) throw Error("User not authenticaed");
    await prisma.workspace.create({
      data: {
        encryptedName,
        users: {
          create: {
            userId: user.id,
            encryptedWorkspaceSecretKey,
            permissions: [
              WorkspaceUserPermission.EDIT,
              WorkspaceUserPermission.DELETE,
              WorkspaceUserPermission.MANAGE_USERS,
              WorkspaceUserPermission.VIEW,
              WorkspaceUserPermission.CREATOR,
              WorkspaceUserPermission.ADD,
            ],
          },
        },
      },
    });
  }
);

export default createWorkspace;
