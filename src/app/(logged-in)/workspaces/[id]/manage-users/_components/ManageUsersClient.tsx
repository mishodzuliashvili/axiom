"use client";

import { useState, useEffect } from "react";
import {
  WorkspaceUserPermission,
  User,
  WorkspaceUser,
} from "@/lib/generated/prisma";
import {
  CheckCircle,
  Shield,
  Trash2,
  UserPlus,
  Eye,
  Edit,
  Users,
  Lock,
  X,
  AlertTriangle,
} from "lucide-react";
import useWorkspaceDecryption from "@/lib/hooks/useWorkspaceDecryption";
import { getUserWithUsername } from "../_actions.ts/getUserWithUsername";
import {
  decryptWithPrivateKey,
  encryptWithPublicKey,
} from "@/lib/cryptoClientSide";
import { getUserInfo } from "@/lib/clientUserStore";
import { inviteUserToWorkspace } from "../_actions.ts/inviteUserToWorkspace";
import { removeUserFromWorkspace } from "../_actions.ts/removeUserFromWorkspace";
import { updateUserPermissions } from "../_actions.ts/updateUserPermissions";

type WorkspaceUserWithUser = WorkspaceUser & {
  user: User;
};

interface ManageUsersClientProps {
  encryptedName: string;
  workspaceId: string;
  workspaceUsers: WorkspaceUserWithUser[];
  currentUserId: string;
  encryptedWorkspaceKey: string;
}

export default function ManageUsersClient({
  encryptedName,
  workspaceId,
  workspaceUsers,
  currentUserId,
  encryptedWorkspaceKey,
}: ManageUsersClientProps) {
  const [username, setUsername] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPermissions, setUserPermissions] = useState<
    Record<string, WorkspaceUserPermission[]>
  >({});

  useEffect(() => {
    const initialPermissions: Record<string, WorkspaceUserPermission[]> = {};
    workspaceUsers.forEach((wu) => {
      initialPermissions[wu.userId] = [...wu.permissions];
    });
    setUserPermissions(initialPermissions);
  }, []);

  // Handle invitation submission
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setInviteError("Please enter a username");
      return;
    }

    try {
      setInviteError(null);
      setInviteSuccess(null);
      setIsSubmitting(true);

      const userPublicKey = await getUserWithUsername({
        username: username.trim(),
      });
      if (!userPublicKey.success)
        throw new Error("User public key doesnt exists");
      const user = await getUserInfo();
      if (!user) throw new Error("User info doesnt exists");
      const decryptedWorkspaceKey = await decryptWithPrivateKey(
        encryptedWorkspaceKey,
        user.privateKeyBase64
      );
      const encryptedWorkspaceKeyByUserKey = await encryptWithPublicKey(
        decryptedWorkspaceKey,
        userPublicKey.data.publicKey
      );

      const result = await inviteUserToWorkspace({
        workspaceId,
        userId: userPublicKey.data.id,
        encryptedWorkspaceKey: encryptedWorkspaceKeyByUserKey,
      });

      if (!result.success) {
        setInviteError(result.error);
      } else {
        setInviteSuccess(`Successfully invited ${username}`);
        setUsername("");
      }
    } catch (error) {
      setInviteError("Failed to invite user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle permission toggle
  const togglePermission = async (
    userId: string,
    permission: WorkspaceUserPermission
  ) => {
    const currentPermissions = userPermissions[userId] || [];
    let newPermissions: WorkspaceUserPermission[];

    if (currentPermissions.includes(permission)) {
      newPermissions = currentPermissions.filter((p) => p !== permission);
    } else {
      newPermissions = [...currentPermissions, permission];
    }

    // Update in database
    try {
      setUserPermissions((prev) => ({
        ...prev,
        [userId]: newPermissions,
      }));

      await updateUserPermissions({
        workspaceId,
        userId,
        permissions: newPermissions,
      });
    } catch (error) {
      alert("Failed to update permissions");
    }
  };

  // Handle user removal
  const handleRemoveUser = async (userId: string, username: string) => {
    if (userId === currentUserId) {
      alert("You cannot remove yourself from the workspace");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to remove ${username} from this workspace?`
      )
    ) {
      return;
    }

    try {
      await removeUserFromWorkspace({
        workspaceId,
        userId,
      });
    } catch (error) {
      alert("Failed to remove user");
    }
  };

  // Check if a user has a specific permission
  const hasPermission = (
    userId: string,
    permission: WorkspaceUserPermission
  ) => {
    return userPermissions[userId]?.includes(permission) || false;
  };

  // Permission option components
  const PermissionOption = ({
    userId,
    permission,
    icon: Icon,
    label,
  }: {
    userId: string;
    permission: WorkspaceUserPermission;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={() => togglePermission(userId, permission)}
      disabled={
        userId === currentUserId &&
        permission === WorkspaceUserPermission.MANAGE_USERS
      }
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        hasPermission(userId, permission)
          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800"
      } ${
        userId === currentUserId &&
        permission === WorkspaceUserPermission.MANAGE_USERS
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div>
      {/* Invite Form */}
      <div className="mb-8 bg-gray-800/70 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-blue-400" />
          Invite New User
        </h2>

        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-500"
              />
            </div>

            {inviteError && (
              <div className="flex items-center mt-2 text-red-400 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {inviteError}
              </div>
            )}

            {inviteSuccess && (
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                {inviteSuccess}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {isSubmitting ? "Inviting..." : "Invite User"}
            </button>

            <div className="ml-4 text-sm text-gray-400 flex items-center">
              <Lock className="h-4 w-4 mr-1" />
              Workspace key will be encrypted with user's public key
            </div>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-400" />
          Workspace Users
        </h2>

        <div className="space-y-4">
          {workspaceUsers.map((workspaceUser) => (
            <div
              key={workspaceUser.userId}
              className="bg-gray-800/70 rounded-xl border border-gray-700 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-lg ${
                      workspaceUser.userId === currentUserId
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : "bg-gray-700"
                    } flex items-center justify-center mr-4`}
                  >
                    <span className="text-lg font-bold">
                      {workspaceUser.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {workspaceUser.user.username}
                      {workspaceUser.userId === currentUserId && (
                        <span className="ml-2 text-sm text-blue-400">
                          (You)
                        </span>
                      )}
                    </h3>
                    <div className="text-sm text-gray-400">
                      User ID: {workspaceUser.userId.substring(0, 8)}...
                    </div>
                  </div>
                </div>

                {workspaceUser.userId !== currentUserId && (
                  <button
                    onClick={() =>
                      handleRemoveUser(
                        workspaceUser.userId,
                        workspaceUser.user.username
                      )
                    }
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    aria-label="Remove user"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">Permissions:</div>
                <div className="flex flex-wrap gap-2">
                  <PermissionOption
                    userId={workspaceUser.userId}
                    permission={WorkspaceUserPermission.VIEW}
                    icon={Eye}
                    label="View"
                  />
                  <PermissionOption
                    userId={workspaceUser.userId}
                    permission={WorkspaceUserPermission.EDIT}
                    icon={Edit}
                    label="Edit"
                  />
                  <PermissionOption
                    userId={workspaceUser.userId}
                    permission={WorkspaceUserPermission.DELETE}
                    icon={Trash2}
                    label="Delete"
                  />
                  <PermissionOption
                    userId={workspaceUser.userId}
                    permission={WorkspaceUserPermission.MANAGE_USERS}
                    icon={Shield}
                    label="Manage Users"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
