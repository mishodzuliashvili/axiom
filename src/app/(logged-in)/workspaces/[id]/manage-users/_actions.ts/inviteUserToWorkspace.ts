"use server";

import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const inviteUserToWorkspace = createServerAction(
  z.object({
    userId: z.string().min(1),
    encryptedWorkspaceKey: z.string().min(1),
    workspaceId: z.string().min(1),
  }),
  async ({ encryptedWorkspaceKey, userId, workspaceId }, prisma) => {
    await prisma.workspaceUser.create({
      data: {
        encryptedWorkspaceSecretKey: encryptedWorkspaceKey,
        userId,
        workspaceId,
      },
    });
    revalidatePath("/workspaces");
  }
);
