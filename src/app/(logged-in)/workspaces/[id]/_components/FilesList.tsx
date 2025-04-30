"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  MoreHorizontal,
  Pencil,
  Trash2,
  Download,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  File as PrismaFile,
  WorkspaceUserPermission,
} from "@/lib/generated/prisma";
import { getUserInfo } from "@/lib/clientUserStore";
import {
  decryptWithPrivateKey,
  decryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";
import { deleteFile } from "../_actions/deleteFile";

interface FilesListProps {
  files: PrismaFile[];
  workspaceId: string;
  permissions: WorkspaceUserPermission[];
  workspaceEncryptedKey: string;
}

export default function FilesList({
  files,
  workspaceId,
  permissions,
  workspaceEncryptedKey,
}: FilesListProps) {
  const router = useRouter();
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const canEdit = permissions.includes("EDIT");
  const canDelete = permissions.includes("DELETE");
  const [allFiles, setAllFiles] = useState<
    {
      name: string;
      id: string;
      icon: Promise<JSX.Element>;
    }[]
  >([]);
  const handleEditClick = (file: any) => {
    // In a real app, this would decrypt the file name using the client-side key
    // setFileName(decryptFileName(file.encryptedName));
    // setEditingFileId(file.id);
    setOpenMenu(null);
  };
  const isBinaryFile = (fileName: string): boolean => {
    const binaryExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".zip",
      ".rar",
      ".exe",
      ".dll",
      ".mp3",
      ".mp4",
      ".avi",
      ".mov",
      ".wav",
    ];

    const lowerFileName = fileName.toLowerCase();
    return binaryExtensions.some((ext) => lowerFileName.endsWith(ext));
  };

  // Function to correctly download files, handling both text and binary files
  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      // Get the user info and workspace key
      const userInfo = await getUserInfo();
      if (!userInfo) throw new Error("User information not available");

      const secretKeyForWorkspace = await decryptWithPrivateKey(
        workspaceEncryptedKey,
        userInfo.privateKeyBase64
      );

      // Fetch the encrypted file content and metadata
      const response = files.find((ff) => ff.id === fileId);
      if (!response) throw new Error("Failed to fetch file content");

      // Check if we have metadata
      let fileType = "text/plain";
      let isBinary = false;

      if (response.encryptedMetadata) {
        try {
          // Decrypt metadata if it exists
          const decryptedMetadata = await decryptWithSymmetricKey(
            response.encryptedMetadata,
            secretKeyForWorkspace,
            "text"
          );

          const metadata = JSON.parse(decryptedMetadata as string);
          if (metadata.originalType) {
            fileType = metadata.originalType;
          }
          isBinary = metadata.isBinary === true;
        } catch (error) {
          console.warn("Error parsing metadata, using defaults:", error);
        }
      }

      // For binary files, we need special handling
      if (isBinary) {
        // First decrypt the content (it should be base64 encoded)
        const decryptedBase64 = (await decryptWithSymmetricKey(
          response.content,
          secretKeyForWorkspace,
          "text"
        )) as string;

        // Convert base64 back to binary data
        const binaryString = atob(decryptedBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Create blob with binary data
        const blob = new Blob([bytes], { type: fileType });

        // Download the file
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      } else {
        // For text files, use the original method
        const decryptedContent = await decryptWithSymmetricKey(
          response.content,
          secretKeyForWorkspace,
          "text"
        );

        const blob = new Blob([decryptedContent as string], { type: fileType });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      }

      setOpenMenu(null);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handleSaveFileName = async (fileId: string) => {
    if (fileName.trim() === "") return;

    setIsSubmitting(true);

    try {
      // In a real app, this would encrypt the file name using the client-side key
      // const encryptedName = encryptFileName(fileName);

      // await renameFile({
      //   fileId,
      //   encryptedName,
      // });

      setEditingFileId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to rename file:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      // await deleteFile({ fileId });
      await deleteFile({
        fileId,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const getFileIcon = async (name: string) => {
    if (
      name.endsWith(".doc") ||
      name.endsWith(".docx") ||
      name.endsWith(".txt")
    ) {
      return <FileText className="h-5 w-5 text-blue-400" />;
    } else if (
      name.endsWith(".xls") ||
      name.endsWith(".xlsx") ||
      name.endsWith(".csv") ||
      name.endsWith(".sheet")
    ) {
      return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
    } else if (
      name.endsWith(".jpg") ||
      name.endsWith(".png") ||
      name.endsWith(".gif") ||
      name.endsWith(".svg")
    ) {
      return <FileImage className="h-5 w-5 text-purple-400" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  useEffect(() => {
    console.log("Amazing");
    (async () => {
      const userInfo = await getUserInfo();
      if (!userInfo) throw new Error("Somethign went wrong");
      const secretKeyForWorkspace = await decryptWithPrivateKey(
        workspaceEncryptedKey,
        userInfo.privateKeyBase64
      );
      const allFiles = await Promise.all(
        files.map(async (f) => {
          const dName = await decryptWithSymmetricKey(
            f.encryptedName,
            secretKeyForWorkspace
          );
          return {
            name: dName as string,
            id: f.id,
            icon: getFileIcon((dName as any).toLowerCase()),
          };
        })
      );
      setAllFiles(allFiles);
    })();
  }, []);

  console.log(allFiles);

  return (
    <div className="grid grid-cols-1 gap-4">
      {allFiles.map((file) => (
        <div
          key={file.id}
          className="p-4 rounded-xl bg-gray-800/70 border border-gray-700 hover:bg-gray-800 transition-all"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
              {file.icon}
            </div>

            <div>
              {editingFileId === file.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveFileName(file.id);
                      if (e.key === "Escape") setEditingFileId(null);
                    }}
                  />
                  <button
                    onClick={() => handleSaveFileName(file.id)}
                    disabled={isSubmitting}
                    className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingFileId(null)}
                    className="ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <Link
                  href={`/files/${file.id}`}
                  className="font-semibold text-white hover:text-blue-300 transition-colors"
                >
                  {file.name}
                </Link>
              )}
              <div className="text-xs text-gray-400 flex items-center mt-1">
                <span>Last edited 2 hours ago</span>{" "}
                {/* This would come from file metadata */}
              </div>
            </div>

            <div className="ml-auto flex items-center relative">
              <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium mr-2">
                <Lock className="h-3 w-3 inline-block mr-1" />
                Encrypted
              </div>

              <button
                onClick={() =>
                  setOpenMenu(openMenu === file.id ? null : file.id)
                }
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {openMenu === file.id && (
                <div className="absolute right-0 top-10 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-20">
                  <Link
                    href={`/files/${file.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Open
                  </Link>

                  {canEdit && (
                    <button
                      onClick={() => handleEditClick(file)}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </button>
                  )}

                  <button
                    onClick={() => handleDownloadFile(file.id, file.name)}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
