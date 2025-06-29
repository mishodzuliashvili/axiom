"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Lock, Shield, Menu, X, Trash2 } from "lucide-react"
// import { updateWorkspaceName } from "../actions";
// import { decryptWorkspaceName, encryptWorkspaceName } from "@/lib/encryption";
import { Workspace } from "@/lib/generated/prisma"
import { getUserInfo } from "@/lib/clientUserStore"
import {
  decryptWithPrivateKey,
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
} from "@/lib/cryptoClientSide"
import useWorkspaceDecryption from "@/lib/hooks/useWorkspaceDecryption"
import { updateWorkspaceName } from "../_actions/updateWorkspaceName"
import { deleteWorkspace } from "../_actions/deleteWorkspace"
import { useRouter } from "next/navigation"

interface WorkspaceHeaderProps {
  workspaceEncryptedKey: string
  workspace: Workspace
  canManageUsers: boolean
  canDeleteWorkspace: boolean
}

export default function WorkspaceHeader({
  workspaceEncryptedKey,
  workspace,
  canManageUsers,
  canDeleteWorkspace,
}: WorkspaceHeaderProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [workspaceName, setWorkspaceName] = useState<string>("Uknown")
  const { decryptedData, loading } = useWorkspaceDecryption(
    workspaceEncryptedKey,
    workspace.encryptedName,
  )

  useEffect(() => {
    setWorkspaceName(decryptedData || "Uknown")
  }, [decryptedData])

  const [isSaving, setIsSaving] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    if (workspaceName.trim() === "") return

    setIsSaving(true)

    try {
      const userInfo = await getUserInfo()
      if (!userInfo) throw new Error("Somethign went wrong")
      const secretKeyForWorkspace = await decryptWithPrivateKey(
        workspaceEncryptedKey,
        userInfo.privateKeyBase64,
      )
      const encryptedName = await encryptWithSymmetricKey(
        workspaceName,
        secretKeyForWorkspace,
      )

      await updateWorkspaceName({
        workspaceId: workspace.id,
        encryptedName,
      })

      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update workspace name:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteWorkspace = async () => {
    if (!canDeleteWorkspace) return

    setIsDeleting(true)
    try {
      const result = await deleteWorkspace({ workspaceId: workspace.id })
      if (!result.success) {
        console.error("Failed to delete workspace:", result.error)
        alert("Failed to delete workspace: " + result.error)
      }
      router.push("/dashboard")
      // If successful, the action will redirect to dashboard
    } catch (error) {
      console.error("Failed to delete workspace:", error)
      alert("Failed to delete workspace. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700 sticky top-0 z-30">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-white" />
            </div>

            {isEditing ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave()
                    if (e.key === "Escape") setIsEditing(false)
                  }}
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <h1
                className="text-xl font-bold text-white cursor-pointer hover:text-blue-300 transition-colors line-clamp-1"
                onClick={() => setIsEditing(true)}
                title="Click to edit workspace name"
              >
                {loading ? (
                  <div className="h-7 w-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded"></div>
                ) : (
                  workspaceName
                )}
              </h1>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs text-blue-400">
            <Lock className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">End-to-end encrypted</span>
          </div>

          {canManageUsers && (
            <Link
              href={`/workspaces/${workspace.id}/manage-users`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50"
            >
              <Shield className="h-4 w-4 mr-2" />
              Manage Users
            </Link>
          )}

          {canDeleteWorkspace && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg shadow-red-700/30 hover:shadow-red-700/50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Workspace
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-900/90 z-40 lg:hidden">
            <div className="w-64 h-full bg-gray-900 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Navigation</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <span className="font-medium text-blue-300">Files</span>
                </div>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50">
                  <span className="text-gray-400">Recent Activity</span>
                </div>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50">
                  <span className="text-gray-400">Shared With Me</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <div className="flex items-center mb-4">
                <Trash2 className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-bold text-white">
                  Delete Workspace
                </h3>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{workspaceName}"? This action
                cannot be undone. All files and data in this workspace will be
                permanently deleted.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Workspace"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
