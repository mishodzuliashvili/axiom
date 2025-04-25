import { z } from "zod";
import prisma from "@/lib/prisma";
import { PrismaClient } from "../generated/prisma";

export type ServerActionSuccessResult<T> = { success: true; data: T };
export type ServerActionFailureResult = { success: false; error: string };
export type ServerActionResult<T> =
  | ServerActionSuccessResult<T>
  | ServerActionFailureResult;

export default function createServerAction<T, U>(
  schema: z.ZodSchema<T>,
  logic: (data: T, prisma: PrismaClient) => Promise<U>
) {
  return async (values: T): Promise<ServerActionResult<U>> => {
    try {
      const data = schema.parse(values);
      const result = await logic(data, prisma);
      return { success: true, data: result };
    } catch (error) {
      let errorMessage = "An error occurred while processing the request.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      // console.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
}
