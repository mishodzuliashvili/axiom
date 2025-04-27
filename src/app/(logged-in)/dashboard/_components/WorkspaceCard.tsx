"use client";

import {
  Prisma,
  WorkspaceUser,
  WorkspaceUserPermission,
} from "@/lib/generated/prisma";
import useWorkspaceDecryption from "@/lib/hooks/useWorkspaceDecryption";
import { Lock, Users } from "lucide-react";
import Link from "next/link";

export default function WorkspaceCard({
  workspaceUser,
}: {
  workspaceUser: Prisma.WorkspaceUserGetPayload<{
    include: {
      workspace: {
        include: {
          files: true;
          users: true;
        };
      };
    };
  }>;
}) {
  const { workspace, permissions } = workspaceUser;
  const hasManagePermission = permissions.includes(
    WorkspaceUserPermission.MANAGE_USERS
  );

  const {
    decryptedData: decryptedName,
    loading,
    error,
  } = useWorkspaceDecryption(
    workspaceUser.encryptedWorkspaceSecretKey,
    workspace.encryptedName
  );

  return (
    <Link href={`/dashboard/workspace/${workspace.id}`}>
      <div
        className={`p-5 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white hover:bg-opacity-20 cursor-pointer transition-all`}
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center mr-3">
            <Users className="h-6 w-6 text-blue-300" />
          </div>
          <div>
            <h3 className="font-semibold text-xl text-white line-clamp-1">
              {loading ? (
                <div className="h-7 w-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded"></div>
              ) : (
                decryptedName
              )}
            </h3>
            <div className="text-xs text-gray-400 flex items-center mt-1">
              <span>{workspace.users.length} members</span>
              <span className="mx-2">•</span>
              <span>{workspace.files.length} files</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-6 w-auto px-2 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-300">
              {hasManagePermission ? "Admin" : "Member"}
            </div>
            <div className="h-6 w-auto px-2 rounded-md bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs text-purple-300">
              <Lock className="h-3 w-3 mr-1" />
              Encrypted
            </div>
          </div>

          <div className="flex -space-x-2">
            {workspace.users.slice(0, 3).map((user: any, idx: any) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center ring-2 ring-gray-900"
              >
                {idx + 1}
              </div>
            ))}
            {workspace.users.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">
                +{workspace.users.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
