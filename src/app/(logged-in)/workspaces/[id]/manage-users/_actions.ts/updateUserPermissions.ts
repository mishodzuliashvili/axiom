"use server";

import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updateUserPermissions = createServerAction(
  z.object({
    userId: z.string().min(1),
    workspaceId: z.string().min(1),
    permissions: z.array(z.nativeEnum(WorkspaceUserPermission)),
  }),
  async ({ userId, workspaceId, permissions }, prisma) => {
    await prisma.workspaceUser.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      data: {
        permissions,
      },
    });

    revalidatePath("/workspaces");
  }
);
