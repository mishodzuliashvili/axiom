import Logo from "@/app/_components/Logo";
import { Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  const navigation = {
    connect: [
      {
        name: "Facebook",
        href: "https://www.facebook.com/",
      },
      {
        name: "Instagram",
        href: "https://www.instagram.com/",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/",
      },
    ],
    company: [
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
    ],
  };

  return (
    <footer
      aria-labelledby="footer-heading"
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Company Info Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="transform transition hover:scale-105 duration-300">
              <Logo />
            </div>

            <p className="text-md max-w-md leading-relaxed text-gray-300">
              Private, secure workspace collaboration with end-to-end
              encryption.
            </p>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Made with ❤️ by Straight Forks
              </span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Connect Section */}
              <div>
                <h3 className="text-base font-semibold leading-6 text-white mb-6 pb-2 border-b border-blue-500/30">
                  Connect
                </h3>
                <ul className="space-y-4">
                  {navigation.connect.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200"
                      >
                        <span className="relative inline-block pr-2">
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                          {item.name}
                        </span>
                        <ExternalLink className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Section */}
              <div>
                <h3 className="text-base font-semibold leading-6 text-white mb-6 pb-2 border-b border-blue-500/30">
                  Website
                </h3>
                <ul className="space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="group flex items-center text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 break-words"
                      >
                        <span className="relative inline-block pr-2">
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                          {item.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-blue-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Axiom. All rights reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-full p-2 text-gray-300 hover:text-blue-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="sr-only">Back to top</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
