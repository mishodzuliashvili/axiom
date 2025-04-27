"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KEY_NAME } from "@/lib/constants";
import toast from "react-hot-toast";
import { Shield, Key, Upload, LogIn, Lock, FileText } from "lucide-react";
import { decryptWithPrivateKey } from "@/lib/cryptoClientSide";
import verifyUserCredentials from "../_actions/verifyUserCredentials";
import verifyAuth from "../_actions/verifyAuth";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleCredentialsFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const content = event.target.result;
        const lines = content.split("\n");

        if (lines.length < 2) {
          throw new Error("Invalid credentials file format");
        }

        const extractedUsername = lines[0].trim();
        const extractedPrivateKey = lines[1].trim();

        if (!extractedUsername || !extractedPrivateKey) {
          throw new Error("Invalid credentials file format");
        }

        setUsername(extractedUsername);
        setPrivateKey(extractedPrivateKey);
        // toast.success("Credentials loaded successfully");
      } catch (error) {
        setErrorMessage(
          "Invalid credentials file format. File should contain username on first line and private key on second line."
        );
      }
    };
    reader.readAsText(file);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!username.trim()) {
      setErrorMessage("Username cannot be empty");
      return;
    }

    if (!privateKey.trim()) {
      setErrorMessage("Private key is required");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await verifyUserCredentials({ username });

      if (!response.success) {
        throw new Error(response.error || "User not found");
      }

      const { encryptedToken, publicKey, userId } = response.data;
      const decryptedToken = await decryptWithPrivateKey(
        encryptedToken,
        privateKey
      );

      const verificationResponse = await verifyAuth({
        userId,
        decryptedToken,
      });

      if (!verificationResponse.success) {
        throw new Error("Authentication failed");
      }

      localStorage.setItem(KEY_NAME.USER_ID, userId);
      localStorage.setItem(KEY_NAME.USER_PRIVATE_KEY, privateKey);
      localStorage.setItem(KEY_NAME.USER_PUBLIC_KEY, publicKey);

      toast.success("Login successful!");
      //   router.push("/dashboard");
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Login Container */}
      <div className="container py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column: Login Form */}
          <div
            className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-700 backdrop-blur-xl transform transition-all duration-1000 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Secure Login
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">
              Login to Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Encrypted Account
              </span>
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-blue-300 mb-1"
                >
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800/70 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="privateKey"
                  className="block text-sm font-medium text-blue-300 mb-1"
                >
                  Private Key
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="password"
                    id="privateKey"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="w-full mb-0 rounded-lg border border-gray-600 bg-gray-800/70 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                    placeholder="Paste your private key here"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Your private key is never sent to our servers and is only used
                  locally for authentication.
                </p>
              </div>

              {/* File upload button for credentials */}
              <div className="flex">
                <label
                  htmlFor="credentialsFile"
                  className="flex items-center px-4 py-3 w-full text-center border border-blue-500/50 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 cursor-pointer transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">
                    Fill credentials from file
                  </span>
                  <input
                    id="credentialsFile"
                    name="credentialsFile"
                    type="file"
                    accept=".txt"
                    className="sr-only"
                    onChange={handleCredentialsFileUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 -mt-2">
                File should contain username on first line and private key on
                second line
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 py-3 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    Login to Your Account
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/register"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Don't have an account? Register here
              </Link>
            </div>
          </div>

          {/* Right Column: Info */}
          <div
            className={`mt-10 lg:mt-0 transform transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Welcome Back to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Axiom
              </span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600/30 text-blue-400">
                    <Lock className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">
                    Zero-Knowledge Proof
                  </h3>
                  <p className="mt-2 text-base text-gray-300">
                    Your private key never leaves your device. We verify your
                    identity through cryptographic challenges without seeing
                    your key.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600/30 text-blue-400">
                    <Key className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">
                    Key Security
                  </h3>
                  <p className="mt-2 text-base text-gray-300">
                    Your private key is the gateway to your encrypted data. Keep
                    it safe and backed up in a secure location.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6 mt-8 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-white mb-2">
                  Lost your private key?
                </h3>
                <p className="text-gray-300 mb-4">
                  Unfortunately, we cannot recover your private key as it was
                  never stored on our servers. This ensures maximum security for
                  your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
