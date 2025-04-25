"use client";

import { useState } from "react";
import doesUsernameExist from "../_actions/checkUsername";
import createUser from "../_actions/createUser";
import { useRouter } from "next/navigation";
import { KEY_NAME } from "@/lib/constants";
import { generateKeyPairClient } from "@/lib/cryptoCLientSide";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  const handleUsernameCheck = async () => {
    if (!username.trim()) {
      setErrorMessage("Username cannot be empty");
      return;
    }
    setCheckingUsername(true);
    const res = await doesUsernameExist({ username });
    if (res.success) {
      if (res.data) {
        setErrorMessage("Username already exists try different one");
      } else {
        setStep(1);
      }
    } else {
      setErrorMessage(res.error);
    }
    setCheckingUsername(false);
  };

  const handleCreateAccount = async () => {
    setCreatingAccount(true);

    try {
      // Generate encryption keys
      const { publicKeyBase64, privateKeyBase64 } =
        await generateKeyPairClient();
      // Store private key in local storage (in real app, use a more secure method)
      localStorage.setItem(KEY_NAME.USER_PRIVATE_KEY, privateKeyBase64);
      localStorage.setItem(KEY_NAME.USER_PUBLIC_KEY, publicKeyBase64);

      await createUser({ username, publicKey: publicKeyBase64 });
      toast.success("You successfuly registered");
      router.push("/");
    } catch (error) {
      setErrorMessage("Failed to create account");
    }
  };

  return (
    <div className="space-y-4">
      <div>{errorMessage}</div>
      {step === 0 && (
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Choose Username
          </label>
          <div className="flex gap-2">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter a unique username"
            />
            <button
              onClick={handleUsernameCheck}
              disabled={checkingUsername}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Check
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="pt-2">
          <button
            onClick={handleCreateAccount}
            disabled={creatingAccount}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {creatingAccount ? "Creating Account..." : "Create Account"}
          </button>
          <p className="mt-2 text-xs text-gray-500">
            This will generate a secure encryption key pair for your account.
            The private key will be stored locally on your device.
          </p>
        </div>
      )}
    </div>
  );
}
