"use server";

import { getUser } from "@/lib/auth";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteFile = createServerAction(
  z.object({
    fileId: z.string().min(1),
  }),
  async ({ fileId }, prisma) => {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.file.delete({
      where: {
        id: fileId,
        Workspace: {
          users: {
            some: {
              userId: user.id,
              permissions: {
                has: WorkspaceUserPermission.DELETE,
              },
            },
          },
        },
      },
    });

    revalidatePath("/workspaces");
  }
);
