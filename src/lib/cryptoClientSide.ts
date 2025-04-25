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

// const encryptData = async (publicKeyBase64: any, data: any) => {

// };

// const decryptData = async (privateKeyBase64: any, encryptedData: any) => {

// };

// const signData = async (privateKeyBase64: any, data: any) => {

// };

// const verifySignature = async (
//   publicKeyBase64: any,
//   data: any,
//   signature: any
// ) => {

// };
