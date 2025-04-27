"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KEY_NAME } from "@/lib/constants";
import { Shield, Lock, CheckCircle } from "lucide-react";

import {
  generateSymmetricKey,
  encryptWithPublicKey,
  encryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";
import toast from "react-hot-toast";
import createWorkspace from "./_actions/createWorkspace";
import { getUserInfo } from "@/lib/clientUserStore";
import Link from "next/link";

export default function WorkspacesCreatePage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      setErrorMessage("Workspace name cannot be empty");
      return;
    }

    setCreatingWorkspace(true);
    setErrorMessage("");

    try {
      const userInfo = await getUserInfo();

      if (!userInfo) {
        throw new Error("User authentication information missing");
      }

      const workspaceSecretKey = await generateSymmetricKey();

      const encryptedName = await encryptWithSymmetricKey(
        workspaceName,
        workspaceSecretKey
      );

      const encryptedWorkspaceSecretKey = await encryptWithPublicKey(
        workspaceSecretKey,
        userInfo.publicKeyBase64
      );

      const result = await createWorkspace({
        encryptedName,
        encryptedWorkspaceSecretKey,
      });

      if (result.success) {
        toast.success("Workspace created successfully!");
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create workspace");
      }
    } catch (error) {
      setErrorMessage("Failed to create workspace. Please try again.");
    } finally {
      setCreatingWorkspace(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-16">
      <div className="max-w-md mx-auto">
        {/* Security badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30">
            <Shield className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-300">
              End-to-End Encrypted
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-xl">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center">
              <Lock className="h-5 w-5 text-blue-400 mr-2" />
              Create New Workspace
            </h2>
          </div>

          <div className="p-6">
            {errorMessage && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="workspaceName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Workspace Name
                </label>
                <div className="relative rounded-md">
                  <input
                    id="workspaceName"
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/70 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="Enter workspace name"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateWorkspace}
                disabled={creatingWorkspace || !workspaceName.trim()}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 py-4 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {creatingWorkspace ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Workspace...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Create Workspace
                  </span>
                )}
              </button>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-white">
                      End-to-End Encryption
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Military-grade protection
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-white">
                      Zero Knowledge
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Only you control access
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 p-4">
                <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
                  <Shield className="h-4 w-4 text-blue-400 mr-2" />
                  Security Information
                </h4>
                <p className="text-sm text-gray-400">
                  Your workspace name will be encrypted before being stored. A
                  secure encryption key will be generated for this workspace,
                  and it will be encrypted with your public key for maximum
                  security.
                </p>
              </div>

              <Link
                href="/workspaces"
                className="w-full text-gray-400 text-sm hover:text-blue-300 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Workspaces
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
