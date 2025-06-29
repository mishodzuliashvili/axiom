"use server"

import { getUser } from "@/lib/auth"
import { WorkspaceUserPermission } from "@/lib/generated/prisma"
import createServerAction from "@/lib/utils/createServerAction"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export const deleteWorkspace = createServerAction(
  z.object({
    workspaceId: z.string().min(1),
  }),
  async ({ workspaceId }, prisma) => {
    const user = await getUser()
    if (!user) {
      throw new Error("User not found")
    }

    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: {
        userId: user.id,
        workspaceId: workspaceId,
      },
    })

    if (!workspaceUser) {
      throw new Error("User not found in workspace")
    }

    const permissions = workspaceUser.permissions || []
    if (!permissions.includes(WorkspaceUserPermission.CREATOR)) {
      throw new Error("Only workspace creators can delete workspaces")
    }

    // Delete the workspace (cascade will handle related records)
    await prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    })

    revalidatePath("/dashboard")
    // redirect('/dashboard');
  },
)
