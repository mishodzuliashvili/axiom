"use client";

import {
  Plus,
  Shield,
  X,
  Menu,
  Home,
  Info,
  Network,
  MessageCircle,
  Lock,
  ChevronRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Prisma } from "@prisma/client";
import Logo from "@/app/_components/Logo";
import AuthBlock from "./AuthBlock";

export default function Navbar({
  user,
  openSidebar,
  isSidebarOpened,
}: {
  user: Prisma.UserGetPayload<{}> | null;
  openSidebar: () => void;
  isSidebarOpened: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const homeLink = user ? "/dashboard" : "/";
  const NAV_ITEMS = [
    { href: homeLink, label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: MessageCircle },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`top-0 left-0 right-0 w-screen fixed z-[100] transition-all duration-300 border-b ${"bg-gray-900 shadow-lg"}`}
    >
      {/* Glowing border at top */}
      {/* <div className="h-[2px] w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div> */}

      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center">
              <div className="transition-transform duration-200 hover:scale-105">
                {homeLink && <Logo href={homeLink.toString()} />}
              </div>
            </div>

            <div className="items-center space-x-3 md:flex hidden">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="relative group">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors duration-200">
                    <Icon size={18} className="text-blue-400" />
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors duration-200">
                      {label}
                    </span>
                  </div>
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user && (
              <Link
                href="/workspaces/create"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white rounded-full border border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Plus size={16} className="text-blue-400" />
                <span className="hidden lg:inline font-medium text-sm line-clamp-1">
                  New Workspace
                </span>
              </Link>
            )}

            <div className="flex items-center gap-2">
              {/* {user && (
                <Link
                  href="/workspaces"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Network size={16} className="text-blue-400" />
                  <span className="hidden lg:inline font-medium text-sm">
                    Workspaces
                  </span>
                </Link>
              )} */}

              {!user && (
                <>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <User size={16} className="text-blue-400" />
                    <span className="hidden lg:inline font-medium text-sm">
                      Register
                    </span>
                  </Link>

                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-md shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-300 hover:scale-105"
                  >
                    <Lock size={16} className="text-white" />
                    <span className="hidden lg:inline font-medium text-sm">
                      Login
                    </span>
                    <ChevronRight size={16} className="hidden lg:block" />
                  </Link>
                </>
              )}

              <AuthBlock user={user} />

              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all duration-300"
                onClick={openSidebar}
                aria-label="Toggle menu"
              >
                {isSidebarOpened ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
