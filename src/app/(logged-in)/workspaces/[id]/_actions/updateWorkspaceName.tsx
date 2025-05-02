"use server";

import { getUser } from "@/lib/auth";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updateWorkspaceName = createServerAction(
  z.object({
    encryptedName: z.string().min(1),
    workspaceId: z.string().min(1),
  }),
  async ({ workspaceId, encryptedName }, prisma) => {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.id,
        workspaceId: workspaceId,
      },
    });
    if (!workspaceUser) {
      throw new Error("User not found in workspace");
    }

    const permissions = workspaceUser.permissions || [];
    if (!permissions.includes(WorkspaceUserPermission.EDIT)) {
      throw new Error("User does not have permission to create files");
    }

    await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        encryptedName,
      },
    });

    revalidatePath("/workspaces");
  }
);
