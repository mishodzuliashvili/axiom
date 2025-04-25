"use server";
import createServerAction from "@/lib/utils/createServerAction";
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

    const c = await cookies();
    c.set("userPublicKey", publicKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
);

export default createUser;
