"use client";
import { getUserInfo } from "@/lib/clientUserStore";
import { useEffect, useState } from "react";
import { File as PrismaFile } from "@/lib/generated/prisma";
import {
  decryptWithPrivateKey,
  decryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";
import MarkdownEditor from "./MarkdownEditor";

export default function InfoFiller({
  userId,
  file,
  encryptedWorkspaceSecretKey,
  viewOnly,
}: {
  file: PrismaFile;
  userId: string;
  encryptedWorkspaceSecretKey: string;
  viewOnly: boolean;
}) {
  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [secretKeyForWorkspace, setSecretKeyForWorkspace] =
    useState<string>("");
  const [loaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getUserInfo();
        if (!user) throw new Error("User not authenticated");

        const secretKey = await decryptWithPrivateKey(
          encryptedWorkspaceSecretKey,
          user.privateKeyBase64
        );

        const decryptedContent = await decryptWithSymmetricKey(
          file.content,
          secretKey
        );

        const decryptedName = await decryptWithSymmetricKey(
          file.encryptedName,
          secretKey
        );

        setSecretKeyForWorkspace(secretKey);
        setFileContent(decryptedContent as string);
        setFileName(decryptedName as string);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to initialize editor:", error);
        // Handle error appropriately (show error UI, etc.)
      }
    };

    initialize();
  }, [encryptedWorkspaceSecretKey, file]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-4xl">
          <span className=" text-xl font-semibold w-full border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-1 px-1">
            {fileName}
          </span>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <MarkdownEditor
          userId={userId}
          fileId={file.id}
          fileContent={fileContent}
          secretKeyForWorkspace={secretKeyForWorkspace}
          viewOnly={viewOnly}
        />
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">End-to-end encrypted</div>
      </div>
    </div>
  );
}
