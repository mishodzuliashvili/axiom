import React, { useState, useEffect } from "react";
import _toast, { ToastOptions } from "react-hot-toast";
import {
  CheckCircle,
  AlertCircle,
  Info,
  Loader,
  X,
  Lock,
  Shield,
} from "lucide-react";

// Custom toast component that matches your hero section style
const customToast = {
  // Success toast with blue/purple gradient
  success: (message: string, options: ToastOptions = {}) => {
    return _toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 shadow-lg rounded-lg pointer-events-auto flex border border-blue-500/30`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-lg bg-blue-500/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-blue-300">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-blue-500/20">
            <button
              onClick={() => _toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      options
    );
  },

  // Error toast with red accents
  error: (message: string, options: ToastOptions = {}) => {
    return _toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-800 to-red-900/40 shadow-lg rounded-lg pointer-events-auto flex border border-red-500/30`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-lg bg-red-500/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-300">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-red-500/20">
            <button
              onClick={() => _toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      options
    );
  },

  // Loading toast with animation
  loading: (message: string, options: ToastOptions = {}) => {
    return _toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/40 shadow-lg rounded-lg pointer-events-auto flex border border-purple-500/30`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <Loader className="h-6 w-6 text-purple-400 animate-spin" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-purple-300">{message}</p>
              </div>
            </div>
          </div>
        </div>
      ),
      { ...options, duration: options.duration || Infinity }
    );
  },

  // Info toast with blue accents
  info: (message: string, options: ToastOptions = {}) => {
    return _toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 shadow-lg rounded-lg pointer-events-auto flex border border-blue-500/30`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-lg bg-blue-500/30 flex items-center justify-center">
                  <Info className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-blue-300">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-blue-500/20">
            <button
              onClick={() => _toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      options
    );
  },

  // Secure toast with lock icon, matching your security theme
  secure: (message: string, options: ToastOptions = {}) => {
    return _toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 shadow-lg rounded-lg pointer-events-auto flex border border-blue-500/30`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-400 mr-2" />
                  <p className="text-sm font-medium text-blue-300">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-blue-500/20">
            <button
              onClick={() => _toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      options
    );
  },

  // Custom toast with animation and badge
  custom: (
    message: string,
    icon: React.ReactNode,
    options: ToastOptions = {}
  ) => {
    return _toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 shadow-lg rounded-lg pointer-events-auto flex border border-gray-700`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                  {icon}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-300">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-700">
            <button
              onClick={() => _toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      options
    );
  },
};

export default customToast;
