"use server";

import createServerAction from "@/lib/utils/createServerAction";
import { z } from "zod";

const doesUsernameExist = createServerAction(
  z.object({
    username: z.string().min(1),
  }),
  async ({ username }, prisma) => {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    return !!existingUser;
  }
);

export default doesUsernameExist;
