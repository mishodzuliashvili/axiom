// import { useEffect, useState } from "react";
// import { KEY_NAME } from "../constants";
// import {
//   decryptWithPrivateKey,
//   decryptWithSymmetricKey,
// } from "../cryptoClientSide";

// function useMultipleWorkspaceDecryption(
//   encryptedWorkspaceSecretKey: string,
//   encryptedItems: string[]
// ) {
//   const [decryptedItems, setDecryptedItems] = useState<>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const decryptItems = async () => {
//       try {
//         setLoading(true);
//         const privateKeyBase64 = localStorage.getItem(
//           KEY_NAME.USER_PRIVATE_KEY
//         );

//         if (!privateKeyBase64) {
//           throw new Error("Private key not found in local storage");
//         }

//         const workSpaceSecretKey = await decryptWithPrivateKey(
//           encryptedWorkspaceSecretKey,
//           privateKeyBase64
//         );

//         const results = {};
//         for (const [key, encryptedValue] of Object.entries(encryptedItems)) {
//           results[key] = await decryptWithSymmetricKey(
//             encryptedValue,
//             workSpaceSecretKey
//           );
//         }

//         setDecryptedItems(results);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (encryptedWorkspaceSecretKey && Object.keys(encryptedItems).length > 0) {
//       decryptItems();
//     }
//   }, [encryptedWorkspaceSecretKey, encryptedItems]);

//   return { decryptedItems, loading, error };
// }
