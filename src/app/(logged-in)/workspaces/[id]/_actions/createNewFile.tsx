"use server";

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
  async ({ encryptedContent, encryptedName, workspaceId, encryptedMetadata }, prisma) => {
    await prisma.file.create({
      data: {
        content: encryptedContent,
        encryptedName: encryptedName,
        workspaceId: workspaceId,
        encryptedMetadata: encryptedMetadata
      },
    });

    revalidatePath("/workspaces");
  }
);
