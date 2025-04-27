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

// Encrypt data with a symmetric key
export const encryptWithSymmetricKey = async (data: any, keyBase64: any) => {
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

    // Encode the data
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

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
    const encryptedBase64 = btoa(String.fromCharCode(...result));

    return encryptedBase64;
  } catch (error) {
    console.error("Error encrypting with symmetric key:", error);
    throw new Error("Failed to encrypt data");
  }
};

// Decrypt data with a symmetric key
export const decryptWithSymmetricKey = async (
  encryptedBase64: any,
  keyBase64: any
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
      ["decrypt"]
    );

    // Decode the base64 encrypted data
    const encryptedString = atob(encryptedBase64);
    const encryptedBuffer = new Uint8Array(
      [...encryptedString].map((char) => char.charCodeAt(0))
    );

    // Extract the IV (first 12 bytes)
    const iv = encryptedBuffer.slice(0, 12);

    // Extract the encrypted data (everything after the IV)
    const dataBuffer = encryptedBuffer.slice(12);

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      dataBuffer
    );

    // Convert the decrypted buffer to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Error decrypting with symmetric key:", error);
    throw new Error("Failed to decrypt data");
  }
};
