"use server";

import createServerAction from "@/lib/utils/createServerAction";
import { z } from "zod";
import { encryptWithPublicKey } from "@/lib/cryptoServerSide";
import jwt from "jsonwebtoken";
import { envServer } from "@/lib/envServer";
const verifyUserCredentials = createServerAction(
  z.object({
    username: z.string().min(1),
  }),
  async ({ username }, prisma) => {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      envServer.JWT_SECRET_KEY,
      { expiresIn: "1m" }
    );
    

    const encryptedToken = encryptWithPublicKey(token, user.publicKey);

    return {
      userId: user.id,
      publicKey: user.publicKey,
      encryptedToken,
    };
  }
);

export default verifyUserCredentials;
