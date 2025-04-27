import { useEffect, useState } from "react";
import { KEY_NAME } from "../constants";
import {
  decryptWithPrivateKey,
  decryptWithSymmetricKey,
} from "../cryptoClientSide";

function useWorkspaceDecryption(
  encryptedWorkspaceSecretKey: string,
  encryptedData: string
) {
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decryptData = async () => {
      try {
        setLoading(true);
        const privateKeyBase64 = localStorage.getItem(
          KEY_NAME.USER_PRIVATE_KEY
        );

        if (!privateKeyBase64) {
          throw new Error("Private key not found in local storage");
        }

        const workSpaceSecretKey = await decryptWithPrivateKey(
          encryptedWorkspaceSecretKey,
          privateKeyBase64
        );

        const decryptedValue = await decryptWithSymmetricKey(
          encryptedData,
          workSpaceSecretKey
        );

        setDecryptedData(decryptedValue);
      } catch (err) {
        setError("Something Went Wrong");
      } finally {
        setLoading(false);
      }
    };

    if (encryptedWorkspaceSecretKey && encryptedData) {
      decryptData();
    }
  }, [encryptedWorkspaceSecretKey, encryptedData]);

  return { decryptedData, loading, error };
}

export default useWorkspaceDecryption;
