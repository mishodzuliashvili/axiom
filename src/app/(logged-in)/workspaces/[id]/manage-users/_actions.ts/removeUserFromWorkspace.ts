"use server";

import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const removeUserFromWorkspace = createServerAction(
  z.object({
    userId: z.string().min(1),
    workspaceId: z.string().min(1),
  }),
  async ({ userId, workspaceId }, prisma) => {
    await prisma.workspaceUser.delete({
      where: {
        workspaceId_userId: {
          userId,
          workspaceId,
        },
      },
    });
    revalidatePath("/workspaces");
  }
);
