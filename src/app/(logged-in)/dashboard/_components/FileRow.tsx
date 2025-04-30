"use client";
import { File as PrismaFile } from "@/lib/generated/prisma";
import useWorkspaceDecryption from "@/lib/hooks/useWorkspaceDecryption";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function FileRow({
  file,
  encryptedWorkspaceSecretKey,
  encryptedWorkspaceName,
}: {
  encryptedWorkspaceSecretKey: string;
  file: PrismaFile;
  encryptedWorkspaceName: string;
}) {
  const {
    decryptedData: fileName,
    loading: fileNameLoading,
    error: fileNameError,
  } = useWorkspaceDecryption(encryptedWorkspaceSecretKey, file.encryptedName);

  const {
    decryptedData: workspaceName,
    loading: workspaceNameLoading,
    error: workspaceNameError,
  } = useWorkspaceDecryption(
    encryptedWorkspaceSecretKey,
    encryptedWorkspaceName
  );

  return (
    <tr key={file.id} className="hover:bg-gray-750">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">
              {fileNameLoading ? (
                <div className="animate-pulse bg-gray-700 h-4 w-32 rounded"></div>
              ) : fileNameError ? (
                <span className="text-red-500">Error</span>
              ) : (
                fileName
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">
          {workspaceNameLoading ? (
            <div className="animate-pulse bg-gray-700 h-4 w-32 rounded"></div>
          ) : workspaceNameError ? (
            <span className="text-red-500">Error</span>
          ) : (
            workspaceName
          )}
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
  );
}
