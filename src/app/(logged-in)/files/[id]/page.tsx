import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import MarkdownFileEditor from "./_components/MarkdownFileEditor";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";

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

  // That page should be completly client side page where user can alter data(encrypted by workspace secret key)
  // and send it over internet to different users via websiocket on that application,
  // so when others will see there should be some consistent manner to merge content
  return (
    <div>
      <MarkdownFileEditor
        encryptedWorkspaceSecretKey={workspaceUser.encryptedWorkspaceSecretKey}
        file={file}
      />
    </div>
  );
}
