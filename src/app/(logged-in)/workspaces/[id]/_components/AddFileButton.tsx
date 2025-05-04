"use client";

import { useState } from "react";
import { Plus, Upload, FileText, X, SquareMIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createNewFile } from "../_actions/createNewFile";
import { getUserInfo } from "@/lib/clientUserStore";
import {
  decryptWithPrivateKey,
  encryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";
import { FILE_TYPES, FileMetadata } from "@/lib/files";

interface AddFileButtonProps {
  workspaceId: string;
  workspaceEncryptedKey: string;
}

export default function AddFileButton({
  workspaceId,
  workspaceEncryptedKey,
}: AddFileButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "upload">("create");

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim() === "") return;

    setIsCreating(true);

    try {
      const userInfo = await getUserInfo();
      if (!userInfo) throw new Error("Something went wrong");
      const secretKeyForWorkspace = await decryptWithPrivateKey(
        workspaceEncryptedKey,
        userInfo.privateKeyBase64
      );
      const encryptedName = await encryptWithSymmetricKey(
        fileName,
        secretKeyForWorkspace
      );
      const encryptedContent = await encryptWithSymmetricKey(
        fileContent,
        secretKeyForWorkspace
      );

      const metadata = JSON.stringify({
        fileType: "MARKDOWN",
      } as FileMetadata);

      const encryptedMetadata = await encryptWithSymmetricKey(
        metadata,
        secretKeyForWorkspace
      );
      const res = await createNewFile({
        workspaceId,
        encryptedName,
        encryptedContent,
        encryptedMetadata,
      });

      if (!res.success) {
        throw new Error("Failed to upload file");
      }

      setIsModalOpen(false);
      setFileName("");
      setFileContent("");
      router.refresh();
    } catch (error) {
      console.error("Failed to create file:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as text"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadFile || fileName.trim() === "") return;

    if (
      !uploadFile.name
        .toLowerCase()
        .endsWith("." + FILE_TYPES.MARKDOWN.extension) &&
      uploadFile.type !== FILE_TYPES.MARKDOWN.mimeType
    ) {
      alert("Please upload only Markdown (.md) files");
      return;
    }

    setIsCreating(true);

    try {
      // Read file as text since we're only allowing markdown
      const fileContent = await readFileAsText(uploadFile);

      // Create metadata object
      const metadata = JSON.stringify({
        fileType: "MARKDOWN",
      } as FileMetadata);

      const userInfo = await getUserInfo();
      if (!userInfo) throw new Error("Something went wrong");
      const secretKeyForWorkspace = await decryptWithPrivateKey(
        workspaceEncryptedKey,
        userInfo.privateKeyBase64
      );

      // Encrypt file name
      const encryptedName = await encryptWithSymmetricKey(
        fileName,
        secretKeyForWorkspace
      );

      // Encrypt file content
      const encryptedContent = await encryptWithSymmetricKey(
        fileContent,
        secretKeyForWorkspace
      );

      // Encrypt metadata
      const encryptedMetadata = await encryptWithSymmetricKey(
        metadata,
        secretKeyForWorkspace
      );

      const res = await createNewFile({
        workspaceId,
        encryptedName,
        encryptedContent,
        encryptedMetadata,
      });

      if (!res.success) {
        throw new Error("Failed to upload file");
      }

      setIsModalOpen(false);
      setFileName("");
      setUploadFile(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert(`Upload failed: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Markdown File
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-700 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center">
                <SquareMIcon className="h-5 w-5 text-blue-400 mr-2" />
                <h3 className="text-xl font-bold text-white">
                  Add Markdown File
                </h3>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex border-b border-gray-700 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "create"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("create")}
                >
                  Create New
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "upload"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("upload")}
                >
                  Upload Markdown
                </button>
              </div>

              {activeTab === "create" ? (
                <form onSubmit={handleCreateFile}>
                  <div className="mb-4">
                    <label
                      htmlFor="fileName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      File Name
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="fileName"
                        value={fileName}
                        onChange={(e) =>
                          setFileName(e.target.value.replace(/\.[^/.]+$/, ""))
                        }
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter file name"
                        required
                      />
                      <span className="bg-gray-700 text-gray-300 px-3 py-2 rounded-r-lg border border-gray-700 border-l-0">
                        .md
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Markdown files only (.md)
                    </p>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="fileContent"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Content (Markdown)
                    </label>
                    <textarea
                      id="fileContent"
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 font-mono"
                      placeholder="# Your Markdown Content Here"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Use Markdown syntax for formatting
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isCreating ? "Creating..." : "Create Markdown File"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleFileUpload}>
                  <div className="mb-4">
                    <label
                      htmlFor="uploadFileName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      File Name
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="uploadFileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter file name"
                        required
                      />
                      <span className="bg-gray-700 text-gray-300 px-3 py-2 rounded-r-lg border border-gray-700 border-l-0">
                        .md
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Markdown files only (.md)
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Upload Markdown File
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center">
                      <SquareMIcon className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400 mb-2">
                        {uploadFile
                          ? `${uploadFile.name} (${(
                              uploadFile.size / 1024
                            ).toFixed(2)} KB)`
                          : "Drag & drop a markdown file or click to browse"}
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        accept=".md,text/markdown"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadFile(file);
                            if (!fileName) {
                              // Remove .md extension for the input field
                              const baseName = file.name.replace(/\.md$/, "");
                              setFileName(baseName);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="file-upload"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        Browse Files
                      </label>
                      <p className="text-xs text-gray-400 mt-2">
                        Only .md files are supported
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || !uploadFile}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isCreating ? "Uploading..." : "Upload Markdown"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
