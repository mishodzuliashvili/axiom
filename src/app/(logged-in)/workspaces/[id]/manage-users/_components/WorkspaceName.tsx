"use client";

import useWorkspaceDecryption from "@/lib/hooks/useWorkspaceDecryption";

export default function WorkspaceName({
  encryptedWorkspaceKey,
  encryptedName,
}: {
  encryptedWorkspaceKey: string;
  encryptedName: string;
}) {
  const { decryptedData, loading, error } = useWorkspaceDecryption(
    encryptedWorkspaceKey,
    encryptedName
  );

  return loading ? (
    <div className="h-7 w-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded"></div>
  ) : (
    decryptedData
  );
}
