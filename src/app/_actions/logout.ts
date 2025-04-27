"use server";

import { KEY_NAME } from "@/lib/constants";
import createServerAction from "@/lib/utils/createServerAction";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

export const logout = createServerAction(z.object({}), async () => {
  const c = await cookies();
  c.delete(KEY_NAME.AUTH_TOKEN);
  revalidatePath("/");
});
