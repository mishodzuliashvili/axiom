import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import WorkspaceHeader from "./_components/WorkspaceHeader";
import AddFileButton from "./_components/AddFileButton";
import FilesList from "./_components/FilesList";
import EmptyState from "./_components/EmptyState";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: p.id,
    },
    include: {
      files: true,
      users: true,
    },
  });

  const workspaceUser = workspace?.users.find((u) => u.userId === user.id);
  if (!workspace || !workspaceUser) {
    redirect("/");
  }

  const permissions = workspaceUser.permissions || [];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      <WorkspaceHeader
        workspaceEncryptedKey={workspaceUser.encryptedWorkspaceSecretKey}
        workspace={workspace}
        canManageUsers={permissions.includes("MANAGE_USERS")}
      />

      <div>
        <div className="flex-1 flex container">
          {/* Sidebar */}

          {/* Main content */}
          <div className="flex-1 py-6">
            <div className="container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Files</h2>
                {permissions.includes("EDIT") && (
                  <AddFileButton
                    workspaceEncryptedKey={
                      workspaceUser.encryptedWorkspaceSecretKey
                    }
                    workspaceId={workspace.id}
                  />
                )}
              </div>

              {workspace.files.length > 0 ? (
                <FilesList
                  files={workspace.files}
                  workspaceId={workspace.id}
                  permissions={permissions}
                  workspaceEncryptedKey={
                    workspaceUser.encryptedWorkspaceSecretKey
                  }
                />
              ) : (
                <div>
                  <EmptyState
                    canAdd={permissions.includes("EDIT")}
                    workspaceId={workspace.id}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
