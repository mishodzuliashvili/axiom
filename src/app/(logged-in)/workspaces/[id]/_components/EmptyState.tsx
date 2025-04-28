"use client";

import { FileText, Plus } from "lucide-react";
// import AddFileButton from "./AddFileButton";

interface EmptyStateProps {
  canAdd: boolean;
  workspaceId: string;
}

export default function EmptyState({ canAdd, workspaceId }: EmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
        <FileText className="h-10 w-10 text-gray-500" />
      </div>

      <h3 className="text-xl font-medium text-white mb-2">No files yet</h3>
      <p className="text-gray-400 mb-6 max-w-md">
        This workspace doesn't have any files yet.
      </p>
    </div>
  );
}
