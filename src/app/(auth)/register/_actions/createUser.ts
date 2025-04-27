"use server";
import { setJWTCookie } from "@/lib/auth";
import { KEY_NAME } from "@/lib/constants";
import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const createUser = createServerAction(
  z.object({
    username: z.string().min(1),
    publicKey: z.string().min(1),
  }),
  async ({ username, publicKey }, prisma) => {
    const user = await prisma.user.create({
      data: {
        username,
        publicKey,
      },
    });
    // roca vada gauva mere ra xdeba lol
    await setJWTCookie(user.id);
    revalidatePath("/");
    return user.id;
  }
);

export default createUser;
