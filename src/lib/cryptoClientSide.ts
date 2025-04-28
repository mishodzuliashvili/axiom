export const generateKeyPairClient = async () => {
  try {
    // Generate a CryptoKeyPair using the Web Crypto API
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );

    // Export the public key
    const publicKeyBuffer = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    const publicKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(publicKeyBuffer))
    );

    // Export the private key
    const privateKeyBuffer = await window.crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );
    const privateKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(privateKeyBuffer))
    );

    return { publicKeyBase64, privateKeyBase64 };
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw new Error("Failed to generate encryption keys");
  }
};

export const decryptWithPrivateKey = async (
  encryptedData: any,
  privateKeyBase64: any
) => {
  try {
    // Convert the base64 private key back to a buffer
    const privateKeyString = atob(privateKeyBase64);
    const privateKeyBuffer = new Uint8Array(
      [...privateKeyString].map((char) => char.charCodeAt(0))
    );

    // Import the private key
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false, // not extractable again
      ["decrypt"]
    );

    // Convert the encrypted data from base64 to buffer for decryption
    // Assuming encryptedData is in base64 format
    const encryptedBuffer = new Uint8Array(
      [...atob(encryptedData)].map((char) => char.charCodeAt(0))
    );

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedBuffer
    );

    // Convert the decrypted buffer to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Error decrypting data:", error);
    throw new Error("Failed to decrypt data");
  }
};

export const encryptWithPublicKey = async (data: any, publicKeyBase64: any) => {
  try {
    // Convert the base64 public key back to a buffer
    const publicKeyString = atob(publicKeyBase64);
    const publicKeyBuffer = new Uint8Array(
      [...publicKeyString].map((char) => char.charCodeAt(0))
    );

    // Import the public key
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false, // not extractable again
      ["encrypt"]
    );

    // Convert the data to a buffer for encryption
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      dataBuffer
    );

    // Convert the encrypted buffer to base64 for storage or transmission
    const encryptedBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encryptedBuffer))
    );

    return encryptedBase64;
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw new Error("Failed to encrypt data");
  }
};

// Generate a random symmetric key
export const generateSymmetricKey = async () => {
  try {
    // Generate a new AES-GCM key
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256, // 256-bit key for stronger encryption
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );

    // Export the key to raw format
    const keyBuffer = await window.crypto.subtle.exportKey("raw", key);

    // Convert to base64 for storage
    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));

    return keyBase64;
  } catch (error) {
    console.error("Error generating symmetric key:", error);
    throw new Error("Failed to generate symmetric key");
  }
};

export const encryptWithSymmetricKey = async (
  data: ArrayBuffer | string,
  keyBase64: string
) => {
  try {
    // Convert the base64 key back to a buffer
    const keyString = atob(keyBase64);
    const keyBuffer = new Uint8Array(
      [...keyString].map((char) => char.charCodeAt(0))
    );

    // Import the key
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyBuffer,
      {
        name: "AES-GCM",
      },
      false, // not extractable
      ["encrypt"]
    );

    // Generate a random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Handle data based on type
    let dataBuffer;
    if (typeof data === "string") {
      // Encode text data
      const encoder = new TextEncoder();
      dataBuffer = encoder.encode(data);
    } else if (data instanceof ArrayBuffer) {
      // Use directly if it's already an ArrayBuffer
      dataBuffer = data;
    } else if (ArrayBuffer.isView(data)) {
      // If it's a view (like Uint8Array), get the buffer
      dataBuffer = (data as any).buffer;
    } else {
      throw new Error("Unsupported data type for encryption");
    }

    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      dataBuffer
    );

    // Combine the IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64 for storage or transmission
    return arrayBufferToBase64(result.buffer);
  } catch (error) {
    console.error("Error encrypting with symmetric key:", error);
    throw new Error("Failed to encrypt data");
  }
};

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 65536; // Process in chunks to avoid call stack size exceeded

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
}

// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

// Decrypt data with a symmetric key - Improved for binary files
export const decryptWithSymmetricKey = async (
  encryptedBase64: string,
  keyBase64: string,
  returnType: "text" | "binary" = "text"
): Promise<string | ArrayBuffer> => {
  try {
    // Convert the base64 key back to a buffer
    const keyString = atob(keyBase64);
    const keyBuffer = new Uint8Array(
      [...keyString].map((char) => char.charCodeAt(0))
    );

    // Import the key
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyBuffer,
      {
        name: "AES-GCM",
      },
      false, // not extractable
      ["decrypt"]
    );

    // Convert base64 to ArrayBuffer directly
    const encryptedBuffer = base64ToArrayBuffer(encryptedBase64);
    const encryptedBytes = new Uint8Array(encryptedBuffer);

    // Extract the IV (first 12 bytes)
    const iv = encryptedBytes.slice(0, 12);

    // Extract the encrypted data (everything after the IV)
    const dataBuffer = encryptedBytes.slice(12);

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      dataBuffer
    );

    // Return the appropriate type
    if (returnType === "binary") {
      // Return the actual ArrayBuffer for binary data
      return decryptedBuffer;
    } else {
      // Convert the decrypted buffer to string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    }
  } catch (error) {
    console.error("Error decrypting with symmetric key:", error);
    throw new Error("Failed to decrypt data");
  }
};
// Encrypt data with a symmetric key
// export const encryptWithSymmetricKey = async (data: any, keyBase64: any) => {
//   try {
//     // Convert the base64 key back to a buffer
//     const keyString = atob(keyBase64);
//     const keyBuffer = new Uint8Array(
//       [...keyString].map((char) => char.charCodeAt(0))
//     );

//     // Import the key
//     const key = await window.crypto.subtle.importKey(
//       "raw",
//       keyBuffer,
//       {
//         name: "AES-GCM",
//       },
//       false, // not extractable
//       ["encrypt"]
//     );

//     // Generate a random IV (Initialization Vector)
//     const iv = window.crypto.getRandomValues(new Uint8Array(12));

//     // Handle data appropriately based on type
//     let dataBuffer;
//     if (typeof data === 'string') {
//       // Encode text data
//       const encoder = new TextEncoder();
//       dataBuffer = encoder.encode(data);
//     } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
//       // Use directly if it's already a buffer
//       dataBuffer = data;
//     } else {
//       // Fallback to JSON string for objects
//       const encoder = new TextEncoder();
//       dataBuffer = encoder.encode(JSON.stringify(data));
//     }

//     // Encrypt the data
//     const encryptedBuffer = await window.crypto.subtle.encrypt(
//       {
//         name: "AES-GCM",
//         iv,
//       },
//       key,
//       dataBuffer
//     );

//     // Combine the IV and encrypted data
//     const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
//     result.set(iv);
//     result.set(new Uint8Array(encryptedBuffer), iv.length);

//     // Convert to base64 for storage or transmission
//     let binary = "";
//     const bytes = new Uint8Array(result);
//     const chunkSize = 1024;
//     for (let i = 0; i < bytes.length; i += chunkSize) {
//       const chunk = Array.from(bytes.slice(i, i + chunkSize));
//       binary += String.fromCharCode.apply(null, chunk);
//     }
//     const encryptedBase64 = btoa(binary);

//     return encryptedBase64;
//   } catch (error) {
//     console.error("Error encrypting with symmetric key:", error);
//     throw new Error("Failed to encrypt data");
//   }
// };

// // Decrypt data with a symmetric key - Fixed to properly handle binary data
// export const decryptWithSymmetricKey = async (
//   encryptedBase64: any,
//   keyBase64: any,
//   returnType: "text" | "binary" = "text"
// ): Promise<string | ArrayBuffer> => {
//   try {
//     // Convert the base64 key back to a buffer
//     const keyString = atob(keyBase64);
//     const keyBuffer = new Uint8Array(
//       [...keyString].map((char) => char.charCodeAt(0))
//     );

//     // Import the key
//     const key = await window.crypto.subtle.importKey(
//       "raw",
//       keyBuffer,
//       {
//         name: "AES-GCM",
//       },
//       false, // not extractable
//       ["decrypt"]
//     );

//     // Decode the base64 encrypted data
//     const encryptedString = atob(encryptedBase64);
//     const encryptedBuffer = new Uint8Array(
//       [...encryptedString].map((char) => char.charCodeAt(0))
//     );

//     // Extract the IV (first 12 bytes)
//     const iv = encryptedBuffer.slice(0, 12);

//     // Extract the encrypted data (everything after the IV)
//     const dataBuffer = encryptedBuffer.slice(12);

//     // Decrypt the data
//     const decryptedBuffer = await window.crypto.subtle.decrypt(
//       {
//         name: "AES-GCM",
//         iv,
//       },
//       key,
//       dataBuffer
//     );

//     // Return the appropriate type
//     if (returnType === "binary") {
//       // Return the actual ArrayBuffer for binary data
//       return decryptedBuffer;
//     } else {
//       // Convert the decrypted buffer to string
//       const decoder = new TextDecoder();
//       return decoder.decode(decryptedBuffer);
//     }
//   } catch (error) {
//     console.error("Error decrypting with symmetric key:", error);
//     throw new Error("Failed to decrypt data");
//   }
// };
// Decrypt data with a symmetric key
// export const decryptWithSymmetricKey = async (
//   encryptedBase64: any,
//   keyBase64: any
// ) => {
//   try {
//     // Convert the base64 key back to a buffer
//     const keyString = atob(keyBase64);
//     const keyBuffer = new Uint8Array(
//       [...keyString].map((char) => char.charCodeAt(0))
//     );

//     // Import the key
//     const key = await window.crypto.subtle.importKey(
//       "raw",
//       keyBuffer,
//       {
//         name: "AES-GCM",
//       },
//       false, // not extractable
//       ["decrypt"]
//     );

//     // Decode the base64 encrypted data
//     const encryptedString = atob(encryptedBase64);
//     const encryptedBuffer = new Uint8Array(
//       [...encryptedString].map((char) => char.charCodeAt(0))
//     );

//     // Extract the IV (first 12 bytes)
//     const iv = encryptedBuffer.slice(0, 12);

//     // Extract the encrypted data (everything after the IV)
//     const dataBuffer = encryptedBuffer.slice(12);

//     // Decrypt the data
//     const decryptedBuffer = await window.crypto.subtle.decrypt(
//       {
//         name: "AES-GCM",
//         iv,
//       },
//       key,
//       dataBuffer
//     );

//     // Convert the decrypted buffer to string
//     const decoder = new TextDecoder();
//     return decoder.decode(decryptedBuffer);
//   } catch (error) {
//     console.error("Error decrypting with symmetric key:", error);
//     throw new Error("Failed to decrypt data");
//   }
// };
