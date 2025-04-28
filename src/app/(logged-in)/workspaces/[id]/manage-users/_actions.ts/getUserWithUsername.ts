"use server";
import createServerAction from "@/lib/utils/createServerAction";
import { z } from "zod";

export const getUserWithUsername = createServerAction(
  z.object({
    username: z.string().min(1),
  }),
  async ({ username }, prisma) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) throw new Error("User doenst exists");

    return user;
  }
);
