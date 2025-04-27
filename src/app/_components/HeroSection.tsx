import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  CheckCircle,
  Users,
  Clock,
  Database,
} from "lucide-react";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Animated background elements */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Content Section */}
          <div
            className={`lg:col-span-5 transform transition-all duration-1000 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Enterprise-Grade Security
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              Workspaces.{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Your Privacy.
                </span>
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C48.3333 1.16667 96.6667 -0.5 146 0.5C195.333 1.5 244.667 5.16667 294 11.5"
                    stroke="url(#paint0_linear)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="1"
                      y1="6"
                      x2="294"
                      y2="6"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3B82F6" />
                      <stop offset="1" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Collaborate on files with complete privacy in our revolutionary
              platform. Our zero-knowledge architecture ensures only you and
              your team can access your content — never compromising on security
              or usability.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-white">
                    End-to-End Encryption
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Military-grade protection for all files
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-white">
                    Real-time Collaboration
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Work together seamlessly
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-white">
                    Secure File Sharing
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Control access with precision
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-white">
                    Version History
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Never lose important changes
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1"
              >
                <Lock className="h-5 w-5 mr-2" />
                Start Free Trial
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base font-medium text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-lg shadow-black/5 transform hover:-translate-y-1"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Visual Section */}
          <div
            className={`mt-12 lg:mt-0 lg:col-span-7 transform transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative mx-auto max-w-3xl">
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-xl transform rotate-12 z-10 opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-xl transform -rotate-12 z-10 opacity-70"></div>

              {/* Platform visualization */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-xl">
                {/* Top navigation bar */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1.5">
                      <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm font-medium text-white flex items-center">
                      <Shield className="h-4 w-4 text-blue-400 mr-2" />
                      Axiom Secure Workspace
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <Database className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="flex h-[500px]">
                  {/* Sidebar */}
                  <div className="w-64 bg-gray-900/70 border-r border-gray-700 p-4">
                    <div className="mb-6">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Workspaces
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="font-medium text-blue-300">
                            Marketing Team
                          </span>
                        </div>
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-400">Engineering</span>
                        </div>
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-400">Product Design</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Recent Files
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-gray-400">
                            Q2 Strategy.doc
                          </span>
                        </div>
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                          <span className="text-sm text-gray-400">
                            2025 Budget.sheet
                          </span>
                        </div>
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm text-gray-400">
                            Design System.sketch
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        Marketing Team
                      </h2>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-xl bg-gray-800/70 border border-gray-700 hover:bg-gray-800 cursor-pointer transition-all">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              Q2 Marketing Strategy.doc
                            </h3>
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <span>Edited 2 hours ago</span>
                              <span className="mx-2">•</span>
                              <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center ring-1 ring-gray-800">
                                  J
                                </div>
                                <div className="w-4 h-4 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center ring-1 ring-gray-800">
                                  M
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-auto flex items-center">
                            <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium mr-2">
                              <Lock className="h-3 w-3 inline-block mr-1" />
                              Encrypted
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="pl-12">
                          <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            65% Complete
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 cursor-pointer transition-all">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              Campaign Performance Analytics.sheet
                            </h3>
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <span className="text-green-400 flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                                Active now
                              </span>
                              <span className="mx-2">•</span>
                              <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center ring-1 ring-gray-800">
                                  A
                                </div>
                                <div className="w-4 h-4 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center ring-1 ring-gray-800">
                                  S
                                </div>
                                <div className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-1 ring-gray-800">
                                  T
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-auto flex items-center">
                            <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium mr-2">
                              <Lock className="h-3 w-3 inline-block mr-1" />
                              Encrypted
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="pl-12 flex space-x-2">
                          <div className="h-6 w-16 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-300">
                            Charts
                          </div>
                          <div className="h-6 w-20 rounded-md bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs text-purple-300">
                            Analytics
                          </div>
                          <div className="h-6 w-16 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs text-green-300">
                            Data
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-800/70 border border-gray-700 hover:bg-gray-800 cursor-pointer transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-purple-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              New Product Launch Brief.doc
                            </h3>
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <span>Created yesterday</span>
                              <span className="mx-2">•</span>
                              <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center ring-1 ring-gray-800">
                                  R
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-auto flex items-center">
                            <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium mr-2">
                              <Lock className="h-3 w-3 inline-block mr-1" />
                              Encrypted
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-t border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-xs text-green-400">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      All systems secure
                    </div>
                    <div className="text-xs text-gray-500">
                      Last backup: 10 minutes ago
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-xs text-gray-400 mr-3">
                      <Lock className="h-3 w-3 inline-block mr-1" />
                      End-to-end encrypted
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">
                        L
                      </div>
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">
                        M
                      </div>
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">
                        A
                      </div>
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">
                        S
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">
                        +2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
