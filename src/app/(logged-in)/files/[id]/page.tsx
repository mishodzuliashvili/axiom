import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import InfoFiller from "./_components/InfoFiller";

export default async function FilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const user = await getUser();
  if (!user) notFound();
  const file = await prisma.file.findUnique({
    where: {
      id: p.id,
    },
  });

  if (!file) notFound();

  const workspaceUser = await prisma.workspaceUser.findUnique({
    where: {
      workspaceId_userId: {
        userId: user.id,
        workspaceId: file.workspaceId,
      },
    },
  });

  if (!workspaceUser) notFound();

  if (!workspaceUser.permissions.includes(WorkspaceUserPermission.EDIT))
    notFound();

  return (
    <div>
      <InfoFiller
        userId={user.id}
        encryptedWorkspaceSecretKey={workspaceUser.encryptedWorkspaceSecretKey}
        file={file}
      />
    </div>
  );
}
