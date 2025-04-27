"use client";

import Link from "next/link";
import { Shield, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
          <AlertCircle className="h-4 w-4 text-blue-400 mr-2" />
          <span className="text-sm font-medium text-blue-300">404 Error</span>
        </div>

        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          Page Not{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Found
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          We couldn't locate the page you're looking for. The page may have been
          moved or doesn't exist.
        </p>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden mb-10 border border-gray-700">
          <div className="bg-gray-900/70 px-4 py-3 flex items-center border-b border-gray-700">
            <div className="flex space-x-1.5">
              <div className="h-3 w-3 bg-red-400 rounded-full"></div>
              <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
              <div className="h-3 w-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="ml-2 text-sm text-gray-400">404 Not Found</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-6xl text-gray-600 font-bold mb-4">404</div>
            <p className="text-gray-400 mb-4">
              The page you're looking for is in another castle.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-center text-sm text-blue-400 font-medium">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                Your security is still our priority
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1 mb-3 sm:mb-0"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-base font-medium text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-lg shadow-black/5 transform hover:-translate-y-1"
          >
            My Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}
