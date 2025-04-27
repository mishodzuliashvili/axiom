import { Prisma } from "@prisma/client";

export default function AuthBlock({
  user,
}: {
  user: Prisma.UserGetPayload<{}> | null;
}) {
  return <div></div>;
}
