import { getUser } from "@/lib/auth";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { ArrowLeft, Shield, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ManageUsersClient from "./_components/ManageUsersClient";
import WorkspaceName from "./_components/WorkspaceName";

async function checkWorkspacePermission(workspaceId: string, userId: string) {
  const workspaceUser = await prisma.workspaceUser.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    include: {
      workspace: true,
    },
  });

  if (
    !workspaceUser ||
    !workspaceUser.permissions.includes(WorkspaceUserPermission.MANAGE_USERS)
  ) {
    return null;
  }

  return workspaceUser;
}

async function getWorkspaceUsers(workspaceId: string) {
  return prisma.workspaceUser.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: true,
    },
  });
}

export default async function ManageUsersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const workspaceUser = await checkWorkspacePermission(p.id, user.id);

  if (!workspaceUser) {
    redirect("/dashboard");
  }

  const workspaceUsers = await getWorkspaceUsers(p.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/workspaces/${p.id}`}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workspace
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center mr-4">
              <UserCog className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-blue-400 flex items-center mb-1">
                <Shield className="h-4 w-4 mr-2" />
                <span>Manage Users</span>
              </div>
              <h1 className="text-3xl font-bold">
                <span className="line-clamp-1">
                  <WorkspaceName
                    encryptedWorkspaceKey={
                      workspaceUser.encryptedWorkspaceSecretKey
                    }
                    encryptedName={workspaceUser.workspace.encryptedName}
                  />{" "}
                </span>
                <span className="text-blue-400">Users</span>
              </h1>
            </div>
          </div>

          <div className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30">
            <Users className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-300">
              {workspaceUsers.length} User
              {workspaceUsers.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-xl">
          {/* Top navigation bar */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-white flex items-center">
                <Shield className="h-4 w-4 text-blue-400 mr-2" />
                User Management
              </div>
            </div>
          </div>

          <div className="p-6">
            <Suspense
              fallback={
                <div className="text-center py-8">Loading users...</div>
              }
            >
              <ManageUsersClient
                encryptedName={workspaceUser.workspace.encryptedName}
                workspaceId={p.id}
                workspaceUsers={workspaceUsers}
                currentUserId={user.id}
                encryptedWorkspaceKey={
                  workspaceUser.encryptedWorkspaceSecretKey
                }
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
