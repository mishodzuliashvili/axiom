"use server";

import createServerAction from "@/lib/utils/createServerAction";
import { setJWTCookie } from "@/lib/auth";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envServer } from "@/lib/envServer";
import { revalidatePath } from "next/cache";

const verifyAuth = createServerAction(
  z.object({
    userId: z.string().min(1),
    decryptedToken: z.string().min(1),
  }),
  async ({ userId, decryptedToken }, prisma) => {
    try {
      const decoded = jwt.verify(decryptedToken, envServer.JWT_SECRET_KEY);
      const uId = (decoded as JwtPayload & { userId: string }).userId;
      if (userId && userId === uId) {
        revalidatePath("/");
        await setJWTCookie(userId);
      }
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
);

export default verifyAuth;
