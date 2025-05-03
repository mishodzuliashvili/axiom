"use server";
import { getUser } from "@/lib/auth";
import createServerAction from "@/lib/utils/createServerAction";
import { z } from "zod";

export const getUsernames = createServerAction(
  z.object({
    userIds: z.array(z.string()),
  }),
  async ({ userIds }, prisma) => {
    const user = await getUser();
    if (!user) {
      throw new Error("User not authorized");
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        username: true,
      },
    });
    return users.map((user) => ({
      id: user.id,
      username: user.username,
    }));
  }
);
