import {
  Shield,
  Lock,
  CheckCircle,
  Users,
  Clock,
  Database,
  Search,
  Plus,
  FileText,
  BarChart2,
  File as FileIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getUserWithWorkspacesWithFiles } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WorkspaceUserPermission } from "@/lib/generated/prisma";
import WorkspaceCard from "./_components/WorkspaceCard";

export default async function DashboardPage() {
  const user = await getUserWithWorkspacesWithFiles();

  if (!user) redirect("/went-wrong");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Header */}
      {/* <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Secure Workspace
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-300 placeholder-gray-500"
                placeholder="Search files..."
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.username}</h1>
          <p className="text-gray-300">Your secure workspaces and files</p>
        </div>

        {/* Create New Workspace Button */}
        <div className="mb-8">
          <Link
            href="/workspaces/create"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Workspace
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Workspaces</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {user.workspaces.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                <FileIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Total Files
                </h3>
                <p className="text-3xl font-bold text-purple-400">
                  {user.workspaces.reduce(
                    (acc, workspace) => acc + workspace.workspace.files.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Security Status
                </h3>
                <div className="text-green-400 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  All systems secure
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspaces */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Workspaces</h2>

          {user.workspaces.length === 0 ? (
            <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No workspaces yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first workspace to start collaborating securely
              </p>
              <Link
                href="/workspaces/create"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Workspace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.workspaces.map((workspaceUser) => (
                <WorkspaceCard
                  key={workspaceUser.id}
                  workspaceUser={workspaceUser}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Files */}
        {user.workspaces.length > 0 &&
          user.workspaces.some((w) => w.workspace.files.length > 0) && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Files</h2>
              <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Workspace
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {user.workspaces.flatMap((workspaceUser) =>
                      workspaceUser.workspace.files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-blue-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {file.encryptedName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              {workspaceUser.workspace.encryptedName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                              <Lock className="h-3 w-3 mr-1" />
                              Encrypted
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/files/${file.id}`}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Open
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
