"use client";

import {
  CarFront,
  Globe,
  House,
  Info,
  LogOut,
  Milestone,
  Phone,
  Settings,
  Shield,
  Ticket,
  UserIcon,
  X,
  Lock,
  Network,
  ChevronRight,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  user,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  user: Prisma.UserGetPayload<{}> | null;
}) {
  const SIDEBAR_NAV_ITEMS = [
    { href: user ? "/dashboard" : "/", label: "Home", icon: House },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  const SECONDARY_NAV_ITEMS = user
    ? []
    : [
        { href: "/register", label: "Register", icon: Shield },
        { href: "/login", label: "Login", icon: Lock },
      ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-0 inset-0 backdrop-blur-sm bg-black/50 z-[300] duration-300",
          {
            "visible opacity-100": isSidebarOpen,
            "invisible opacity-0": !isSidebarOpen,
          }
        )}
        onClick={toggleSidebar}
      />

      <div
        className={`fixed bottom-0 right-0 left-auto w-3/4 md:w-72 h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-[400] transform transition-transform duration-300 ease-in-out shadow-xl ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          <div className="absolute top-40 right-10 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-40 left-10 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]"></div>
        </div>

        <div className="flex flex-col h-full relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Secure Menu
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 w-full">
            <div className="px-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                Navigation
              </h3>
              <div className="space-y-1">
                {SIDEBAR_NAV_ITEMS.map((item, index) => {
                  // if (item.requiresAuth && !user) return null;

                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${"hover:bg-white/10"}`}
                      onClick={() => {
                        toggleSidebar();
                      }}
                    >
                      <item.icon
                        size={18}
                        className={`mr-3 ${"text-gray-400 group-hover:text-blue-400"}`}
                      />
                      <span
                        className={`font-medium text-sm ${"text-gray-300 group-hover:text-white"}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 px-4">
              {!user && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  {user ? "Workspaces" : "Account"}
                </h3>
              )}
              <div className="space-y-1">
                {SECONDARY_NAV_ITEMS.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${"hover:bg-white/10"}`}
                      onClick={() => {
                        toggleSidebar();
                      }}
                    >
                      <item.icon
                        size={18}
                        className={`mr-3 ${"text-gray-400 group-hover:text-blue-400"}`}
                      />
                      <span
                        className={`font-medium text-sm ${"text-gray-300 group-hover:text-white"}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {user && (
              <div className="mt-auto px-4 py-6">
                <LogoutButton
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white w-full transition-all duration-200 group"
                  onClick={toggleSidebar}
                >
                  <LogOut
                    size={18}
                    className="mr-3 text-gray-400 group-hover:text-red-400"
                  />
                  <span className="font-medium text-sm">Log Out</span>
                </LogoutButton>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="bg-gray-900/80 px-6 py-4 border-t border-gray-700">
            {user ? (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                  {user.username?.[0] || "U"}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-sm text-white">
                    {user.username || "User"}
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center text-xs text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    Secure
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-blue-400">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Guest Mode</span>
                </div>
                <Link
                  href="/login"
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center"
                  onClick={toggleSidebar}
                >
                  Sign in
                  <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
