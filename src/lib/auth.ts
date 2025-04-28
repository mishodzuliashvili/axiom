import "server-only";
import { cookies } from "next/headers";
import { KEY_NAME } from "./constants";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { WorkspaceUserPermission } from "./generated/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envServer } from "@/lib/envServer";

export async function getUser() {
  const c = await cookies();
  const token = c.get(KEY_NAME.AUTH_TOKEN)?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, envServer.JWT_SECRET_KEY);
      const userId = (decoded as JwtPayload & { userId: string }).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export async function getUserWithWorkspacesWithFiles() {
  const c = await cookies();
  const token = c.get(KEY_NAME.AUTH_TOKEN)?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, envServer.JWT_SECRET_KEY);
      const userId = (decoded as JwtPayload & { userId: string }).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          workspaces: {
            where: {
              permissions: {
                has: WorkspaceUserPermission.VIEW,
              },
            },
            include: {
              workspace: {
                include: {
                  files: true,
                  users: true,
                },
              },
            },
          },
        },
      });
      return user;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export async function ifAuthenticatedRedirect(path?: string) {
  const c = await cookies();
  const token = c.get(KEY_NAME.AUTH_TOKEN)?.value;
  let shouldRedirect = false;
  if (token) {
    try {
      const decoded = jwt.verify(token, envServer.JWT_SECRET_KEY);
      const userId = (decoded as JwtPayload & { userId: string }).userId;
      if (userId) {
        console.log(userId);
        shouldRedirect = true;
      }
    } catch (err) {}
  }
  if (shouldRedirect) {
    redirect(path || "/dashboard");
  }
}

export async function ifNotAuthenticatedRedirect(path?: string) {
  const c = await cookies();
  const token = c.get(KEY_NAME.AUTH_TOKEN)?.value;
  let shouldRedirect = true;
  if (token) {
    try {
      const decoded = jwt.verify(token, envServer.JWT_SECRET_KEY);
      const userId = (decoded as JwtPayload & { userId: string }).userId;
      if (userId) {
        shouldRedirect = false;
      }
    } catch (err) {}
  }
  if (shouldRedirect) {
    redirect(path || "/");
  }
}

export const setJWTCookie = async (userId: string) => {
  const token = jwt.sign(
    { userId },
    envServer.JWT_SECRET_KEY,
    { expiresIn: "30d" } // token valid for 30 days
  );

  const c = await cookies();
  c.set(KEY_NAME.AUTH_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};
