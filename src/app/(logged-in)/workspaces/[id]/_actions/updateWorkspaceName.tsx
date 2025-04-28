"use server";

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
