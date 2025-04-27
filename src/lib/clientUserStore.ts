import { KEY_NAME } from "./constants";

export const getUserInfo = async () => {
  const userId = localStorage.getItem(KEY_NAME.USER_ID);
  const publicKeyBase64 = localStorage.getItem(KEY_NAME.USER_PUBLIC_KEY);
  const privateKeyBase64 = localStorage.getItem(KEY_NAME.USER_PRIVATE_KEY);
  if (!userId || !publicKeyBase64 || !privateKeyBase64) return null;
  return {
    userId,
    publicKeyBase64,
    privateKeyBase64,
  };
};

export const saveUserClient = async (
  privateKeyBase64: string,
  publicKeyBase64: string,
  userId: string
) => {
  localStorage.setItem(KEY_NAME.USER_PRIVATE_KEY, privateKeyBase64);
  localStorage.setItem(KEY_NAME.USER_PUBLIC_KEY, publicKeyBase64);
  localStorage.setItem(KEY_NAME.USER_ID, userId);
};

export const clearUserClient = async () => {
  localStorage.clear();
};
