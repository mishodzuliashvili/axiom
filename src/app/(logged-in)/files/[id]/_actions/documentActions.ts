"use server";

import { getUser } from "@/lib/auth";
import createServerAction from "@/lib/utils/createServerAction";
import { z } from "zod";

const updateFileContentSchema = z.object({
    fileId: z.string(),
    content: z.string(),
});

export const updateFileContent = createServerAction(
    updateFileContentSchema,
    async ({ fileId, content }, prisma) => {
        const user = await getUser();
        if (!user) {
            throw new Error("Unauthorized");
        }

        const file = await prisma.file.findUnique({
            where: { id: fileId },
            include: {
                Workspace: {
                    include: {
                        users: {
                            where: { userId: user.id },
                        },
                    },
                },
            },
        });

        if (!file) {
            throw new Error("File not found");
        }

        if (file.Workspace.users.length === 0) {
            throw new Error("You don't have access to this workspace");
        }

        const workspaceUser = file.Workspace.users[0];
        const hasEditPermission =
            workspaceUser.permissions.includes("EDIT") ||
            workspaceUser.permissions.includes("CREATOR");

        if (!hasEditPermission) {
            throw new Error("You don't have permission to edit this file");
        }

        const updatedFile = await prisma.file.update({
            where: { id: fileId },
            data: {
                content,
            },
        });

        return { id: updatedFile.id };
    }
);