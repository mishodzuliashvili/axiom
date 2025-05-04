import { SquareMIcon } from "lucide-react";
import { cn } from "./utils/cn";
import { JSX } from "react";

export const FILE_TYPES: Record<
  string,
  {
    extension: string;
    mimeType: string;
    name: string;
    icon: (className?: string) => JSX.Element;
    type?: "text" | "binary" | "unknown";
  }
> = {
  MARKDOWN: {
    extension: "md",
    mimeType: "text/markdown",
    name: "Markdown",
    icon: (className?: string) => (
      <SquareMIcon className={cn("h-5 w-5 text-blue-400", className)} />
    ),
    type: "text",
  },
  JSON: {
    extension: "json",
    mimeType: "application/json",
    name: "JSON",
    icon: (className?: string) => (
      <SquareMIcon className={cn("h-5 w-5 text-blue-400", className)} />
    ),
    type: "text",
  },
} as const;

export type FileMetadata = {
  fileType: keyof typeof FILE_TYPES;
};

// we will need functions like isBinary

// const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//   const bytes = new Uint8Array(buffer);
//   let binary = "";
//   const chunkSize = 65536; // Process in chunks to avoid call stack size exceeded

//   for (let i = 0; i < bytes.length; i += chunkSize) {
//     const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length));
//     binary += String.fromCharCode.apply(null, Array.from(chunk));
//   }

//   return btoa(binary);
// };

// const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.result instanceof ArrayBuffer) {
//           resolve(reader.result);
//         } else {
//           reject(new Error("Failed to read file as ArrayBuffer"));
//         }
//       };
//       reader.onerror = () => reject(reader.error);
//       reader.readAsArrayBuffer(file);
//     });
//   };
