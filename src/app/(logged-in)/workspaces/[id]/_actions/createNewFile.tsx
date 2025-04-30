"use server";

import { getUser } from "@/lib/auth";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createNewFile = createServerAction(
  z.object({
    workspaceId: z.string().min(1),
    encryptedName: z.string().min(1),
    encryptedContent: z.string().min(1),
    encryptedMetadata: z.string().min(1),
  }),
  async (
    { encryptedContent, encryptedName, workspaceId, encryptedMetadata },
    prisma
  ) => {
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
    if (!permissions.includes(WorkspaceUserPermission.ADD)) {
      throw new Error("User does not have permission to create files");
    }

    await prisma.file.create({
      data: {
        content: encryptedContent,
        encryptedName: encryptedName,
        workspaceId: workspaceId,
        encryptedMetadata: encryptedMetadata,
      },
    });

    revalidatePath("/workspaces");
  }
);
