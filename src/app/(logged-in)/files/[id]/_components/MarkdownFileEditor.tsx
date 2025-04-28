"use client";
import { getUserInfo } from "@/lib/clientUserStore";
import {
  decryptWithPrivateKey,
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";
import { File as PrismaFile } from "@/lib/generated/prisma";
import { useEffect, useState } from "react";

export default function MarkdownFileEditor({
  file,
  encryptedWorkspaceSecretKey,
}: {
  file: PrismaFile;
  encryptedWorkspaceSecretKey: string;
}) {
  const [loaded, setIsLoaded] = useState(false);
  const [fileContent, setFileContent] = useState("Loading...");
  const [fileName, setFileName] = useState("Loading...");
  const [secretKeyForWorkspace, setSecretKeyForWorkspace] =
    useState("Loading...");

  // if i add something new i can ecrypt it and send it encrypted way with secret key ebcause others can decryot it
  // const encrypted = await encryptWithSymmetricKey(
  //     myContent,
  //     secretKeyForWorkspace
  //   );

  // otherwise if somone adds something it shhould be updated on my side
  // const descrypted = await decryptWithSymmetricKey(
  //     otherContent,
  //     secretKeyForWorkspace
  //   );

  useEffect(() => {
    (async () => {
      const userInfo = await getUserInfo();
      if (!userInfo) throw new Error("Something went wrong");
      const secretKeyForWorkspace = await decryptWithPrivateKey(
        encryptedWorkspaceSecretKey,
        userInfo.privateKeyBase64
      );

      const descryptedFileContent = await decryptWithSymmetricKey(
        file.content,
        secretKeyForWorkspace
      );

      const descryptedFileName = await decryptWithSymmetricKey(
        file.encryptedName,
        secretKeyForWorkspace
      );
      setSecretKeyForWorkspace(secretKeyForWorkspace);
      setFileContent(descryptedFileContent as any);
      setFileName(descryptedFileName as any);
      setIsLoaded(true);
    })();
  }, []);

  if (!loaded) return null;

  return <div></div>;
}
