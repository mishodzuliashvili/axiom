import crypto from "crypto";

export const encryptWithPublicKey = (data: any, publicKeyBase64: string) => {
  try {
    // Decode the base64 to raw buffer
    const publicKeyDer = Buffer.from(publicKeyBase64, "base64");

    // First, create a public key object
    const publicKey = crypto.createPublicKey({
      key: publicKeyDer,
      format: "der",
      type: "spki",
    });

    // Now encrypt using the key object
    const encryptedBuffer = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data, "utf-8")
    );

    // Encode the encrypted data to base64
    const encryptedBase64 = encryptedBuffer.toString("base64");

    return encryptedBase64;
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw new Error("Failed to encrypt data");
  }
};
