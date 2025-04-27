"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import doesUsernameExist from "../_actions/checkUsername";
import createUser from "../_actions/createUser";
import { KEY_NAME } from "@/lib/constants";
import { generateKeyPairClient } from "@/lib/cryptoClientSide";
import toast from "react-hot-toast";
import { Shield, Lock, CheckCircle, Users, Database } from "lucide-react";
import { clearUserClient, saveUserClient } from "@/lib/clientUserStore";

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [willDownloadKey, setWillDownloadKey] = useState(true);

  // Set isLoaded to true after component mounts
  useState(() => {
    setIsLoaded(true);
  });

  const handleUsernameCheck = async () => {
    if (!username.trim()) {
      setErrorMessage("Username cannot be empty");
      return;
    }

    setErrorMessage("");
    setCheckingUsername(true);

    try {
      const res = await doesUsernameExist({ username });

      if (res.success) {
        if (res.data) {
          setErrorMessage(
            "Username already exists, please try a different one"
          );
        } else {
          setStep(1);
        }
      } else {
        setErrorMessage(res.error || "Error checking username");
      }
    } catch (error) {
      setErrorMessage("Failed to verify username");
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleCreateAccount = async () => {
    setCreatingAccount(true);
    setErrorMessage("");

    try {
      const { publicKeyBase64, privateKeyBase64 } =
        await generateKeyPairClient();

      if (willDownloadKey) {
        // === DOWNLOAD PRIVATE KEY AS FILE ===
        const fileContent = `${username}\n${privateKeyBase64}`; // Username on the first line, private key on the second
        const blob = new Blob([fileContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = username + "-axiom-credentials.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // clean up memory
      }

      const res = await createUser({ username, publicKey: publicKeyBase64 });
      if (res.success) {
        await saveUserClient(privateKeyBase64, publicKeyBase64, res.data);
      } else {
        await clearUserClient();
      }

      toast.success("You successfully registered!");
      router.push("/");
    } catch (error) {
      setErrorMessage("Failed to create account. Please try again.");
      setCreatingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Registration Container */}
      <div className="container py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column: Registration Form */}
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
                Secure Registration
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">
              Create Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Encrypted Account
              </span>
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div
                  className={`h-2 w-1/2 ${
                    step === 0 ? "bg-blue-500" : "bg-blue-300"
                  } rounded-l-full`}
                ></div>
                <div
                  className={`h-2 w-1/2 ${
                    step === 1 ? "bg-blue-500" : "bg-gray-700"
                  } rounded-r-full`}
                ></div>
              </div>
              <p className="text-sm text-blue-300">
                {step === 0
                  ? "Step 1: Choose Username"
                  : "Step 2: Create Account"}
              </p>
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-blue-300"
                >
                  Choose Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800/70 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter a unique username"
                  />
                </div>

                <button
                  onClick={handleUsernameCheck}
                  disabled={checkingUsername || !username.trim()}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 py-3 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {checkingUsername ? (
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
                      Checking availability...
                    </span>
                  ) : (
                    "Check Availability"
                  )}
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                  <div className="flex items-start">
                    <div className="text-blue-400 mr-3">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-300">
                        Username available!
                      </h3>
                      <p className="mt-1 text-sm text-blue-200">
                        "{username}" is available. Click below to create your
                        account and generate your encryption keys.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  {/* Terms Checkbox */}
                  <label className="flex items-start space-x-2 text-sm text-blue-300">
                    <input
                      type="checkbox"
                      checked={agreesToTerms}
                      onChange={() => setAgreesToTerms(!agreesToTerms)}
                      className="mt-1 h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>
                      I agree to the{" "}
                      <Link
                        target="_blank"
                        href="/terms"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        Terms of Service
                      </Link>
                      .
                    </span>
                  </label>

                  {/* Download Key Checkbox */}
                  <label className="flex items-start space-x-2 text-sm text-blue-300">
                    <input
                      type="checkbox"
                      checked={willDownloadKey}
                      onChange={() => setWillDownloadKey(!willDownloadKey)}
                      className="mt-1 h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>
                      I understand I must{" "}
                      <span className="font-semibold">
                        download and securely back up
                      </span>{" "}
                      my private key.
                    </span>
                  </label>
                </div>

                {/* Create Button */}
                <button
                  onClick={handleCreateAccount}
                  disabled={
                    creatingAccount || !agreesToTerms || !willDownloadKey
                  }
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 py-3 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {creatingAccount ? (
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
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Create My Account
                    </span>
                  )}
                </button>

                {/* Security Note */}
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Security Note
                  </h4>
                  <p className="text-xs text-gray-400">
                    This will generate a secure encryption key pair for your
                    account. The private key will be stored locally on your
                    device for maximum security. Never share your private key
                    with anyone.
                  </p>
                </div>

                <button
                  onClick={() => setStep(0)}
                  className="w-full mt-2 text-gray-400 text-sm hover:text-blue-300 focus:outline-none transition-colors"
                >
                  ← Go back and choose a different username
                </button>
              </div>
            )}
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
              Join Axiom for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Private Collaboration
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
                    End-to-End Encryption
                  </h3>
                  <p className="mt-2 text-base text-gray-300">
                    Your files are encrypted with state-of-the-art cryptography.
                    Only you and those you explicitly share with can access your
                    content.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600/30 text-blue-400">
                    <Database className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">
                    Secure Workspaces
                  </h3>
                  <p className="mt-2 text-base text-gray-300">
                    Create separate workspaces for different projects or teams,
                    each with its own encryption key and access controls.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600/30 text-blue-400">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">
                    Granular Permissions
                  </h3>
                  <p className="mt-2 text-base text-gray-300">
                    Set precise permissions for teammates: view, edit, delete,
                    and manage user access for truly collaborative work.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6 mt-8 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-white mb-2">
                  Already have an account?
                </h3>
                <p className="text-gray-300 mb-4">
                  Login to access your secure workspaces and continue
                  collaborating with your team.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border text-base font-medium rounded-md text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-lg shadow-black/5 transform hover:-translate-y-1 w-full"
                >
                  Login to Your Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
