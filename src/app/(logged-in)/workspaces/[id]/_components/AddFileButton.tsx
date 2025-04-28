"use client";

import { useState } from "react";
import { Plus, Upload, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createNewFile } from "../_actions/createNewFile";
import { getUserInfo } from "@/lib/clientUserStore";
import {
  decryptWithPrivateKey,
  encryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";

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
        originalType: "text/plain",
        isBinary: false,
      });

      const encryptedMetadata = await encryptWithSymmetricKey(
        metadata,
        secretKeyForWorkspace
      );

      await createNewFile({
        workspaceId,
        encryptedName,
        encryptedContent,
        encryptedMetadata,
      });

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

  // Read file as ArrayBuffer to handle binary files like images
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as ArrayBuffer"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 65536; // Process in chunks to avoid call stack size exceeded

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }

    return btoa(binary);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadFile || fileName.trim() === "") return;

    setIsCreating(true);

    try {
      // Read file as ArrayBuffer instead of text to support binary files
      const fileBuffer = await readFileAsArrayBuffer(uploadFile);

      // Store file type for later use in metadata
      const fileType = uploadFile.type;

      // Create metadata object to store alongside content
      const fileMetadata = JSON.stringify({
        originalType: fileType,
        originalName: uploadFile.name,
        lastModified: uploadFile.lastModified,
        isBinary: true,
      });

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

      // Convert buffer to base64 string
      const base64Content = arrayBufferToBase64(fileBuffer);

      // Encrypt file content (as base64 string)
      const encryptedContent = await encryptWithSymmetricKey(
        base64Content,
        secretKeyForWorkspace
      );

      // Encrypt metadata
      const encryptedMetadata = await encryptWithSymmetricKey(
        fileMetadata,
        secretKeyForWorkspace
      );

      await createNewFile({
        workspaceId,
        encryptedName,
        encryptedContent,
        encryptedMetadata, // Pass metadata to the server
      });

      setIsModalOpen(false);
      setFileName("");
      setUploadFile(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert(`Upload failed:`);
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
        Add File
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
              <h3 className="text-xl font-bold text-white">Add New File</h3>
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
                  Upload File
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
                    <input
                      type="text"
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter file name"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="fileContent"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Content
                    </label>
                    <textarea
                      id="fileContent"
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                      placeholder="Enter file content"
                    />
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
                      {isCreating ? "Creating..." : "Create File"}
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
                    <input
                      type="text"
                      id="uploadFileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter file name"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Upload File
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400 mb-2">
                        {uploadFile
                          ? `${uploadFile.name} (${(
                              uploadFile.size / 1024
                            ).toFixed(2)} KB)`
                          : "Drag & drop a file or click to browse"}
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadFile(file);
                            if (!fileName) {
                              setFileName(file.name);
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
                      {isCreating ? "Uploading..." : "Upload File"}
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
