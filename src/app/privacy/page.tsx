"use client";
import { useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  Share2,
  Key,
  Server,
  User,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const policyData = {
    pageTitle: "Privacy Policy",
    tagline: "True zero-knowledge privacy for your secure workspaces",
    lastUpdated: "April 27, 2025",
    introduction: [
      "At Axiom, we've built our entire platform on the principle of zero-knowledge privacy. This means we've designed our systems so that we cannot access your workspace names, file names, or any content within your workspaces. Everything is encrypted on your device before it reaches our servers, and we never have access to your encryption keys.",
      "This Privacy Policy explains our commitment to your privacy and the minimal information we do collect to provide our service. By using Axiom, you're choosing a service that technically cannot compromise your privacy, even if compelled by legal requests.",
    ],
    sections: [
      {
        id: "info-collect",
        title: "Information We Collect",
        icon: <FileText className="h-6 w-6" />,
        content:
          "We collect the absolute minimum information required to provide our service while maintaining your privacy.",
        subsections: [
          {
            title: "Account Information",
            content:
              "We collect and store only your username in plaintext. This is the only personally identifiable information we maintain in an accessible format.",
          },
          {
            title: "Workspace Information",
            content:
              "We store only the number of workspaces and files associated with your account. We do not have access to workspace names, file names, or any content within your workspaces, as all of this information is encrypted on your device before transmission to our servers.",
          },
          {
            title: "Technical Information",
            content:
              "We collect standard server logs that include IP addresses and timestamps for system administration, security, and troubleshooting purposes. These logs are automatically deleted after 7 days.",
          },
        ],
      },
      {
        id: "zero-knowledge",
        title: "Zero-Knowledge Architecture",
        icon: <Lock className="h-6 w-6" />,
        content:
          "Our platform is built on true zero-knowledge architecture, meaning we have deliberately designed our systems so that we cannot access your content or metadata.",
        subsections: [
          {
            title: "Client-Side Encryption",
            content:
              "All encryption and decryption happens on your device. Your encryption keys are never transmitted to our servers. Even workspace and file names are encrypted before they leave your device.",
          },
          {
            title: "No Access to Keys",
            content:
              "When you share access with others, encryption keys are securely transmitted directly between authorized users. We facilitate this exchange but never have access to the keys themselves.",
          },
          {
            title: "No Data Mining",
            content:
              "Because we cannot decrypt your data, we cannot mine it for information, analyze it for patterns, or use it for any purpose. What you store in Axiom remains completely private to you and those you explicitly share with.",
          },
        ],
      },
      {
        id: "use-info",
        title: "How We Use Information",
        icon: <Eye className="h-6 w-6" />,
        content:
          "The minimal information we collect is used solely to provide and maintain our service.",
        subsections: [
          {
            title: "Account Management",
            content:
              "We use your username to authenticate you and associate your encrypted workspaces and files with your account.",
          },
          {
            title: "Service Provision",
            content:
              "We use metadata about the number of workspaces and files to manage storage allocation and ensure system performance.",
          },
          {
            title: "No Analytics or Tracking",
            content:
              "We do not track how you use the service, which features you access, or any other behavioral information. We cannot see into your workspaces to analyze your usage patterns.",
          },
        ],
      },
      {
        id: "info-sharing",
        title: "Information Sharing",
        icon: <Share2 className="h-6 w-6" />,
        content:
          "We do not share your information with third parties, except in the very limited circumstances described below:",
        subsections: [
          {
            title: "Service Providers",
            content:
              "We use a limited number of service providers for hosting infrastructure. These providers have access only to encrypted data and cannot decrypt it.",
          },
          {
            title: "Legal Requirements",
            content:
              "If compelled by valid legal process, we can only provide what we have: your username and information about the number of encrypted workspaces and files you have. We cannot provide any workspace names, file names, or content, as these are encrypted with keys we do not possess.",
          },
        ],
      },
      {
        id: "data-security",
        title: "Data Security",
        icon: <Shield className="h-6 w-6" />,
        content: "Security is at the core of our service design.",
        subsections: [
          {
            title: "Encryption",
            content:
              "All user content is encrypted using AES-256 encryption. Encryption keys are generated and managed on your device and are never transmitted to our servers in an unencrypted form.",
          },
          {
            title: "Key Management",
            content:
              "Workspace keys are securely shared only with users you explicitly authorize. This sharing process happens through secure channels, and we never have access to the unencrypted keys.",
          },
          {
            title: "Infrastructure Security",
            content:
              "We implement industry best practices for securing our infrastructure, including regular security audits, access controls, and monitoring.",
          },
        ],
      },
      {
        id: "rights-controls",
        title: "Your Rights and Controls",
        icon: <User className="h-6 w-6" />,
        content: "You have complete control over your data on Axiom.",
        subsections: [
          {
            title: "Data Access",
            content:
              "Because of our zero-knowledge architecture, only you and those you explicitly share with can access your data. Not even Axiom employees can access your content.",
          },
          {
            title: "Data Deletion",
            content:
              "You can delete any workspace or file at any time. When you delete your account, all associated encrypted data is permanently removed from our systems within 30 days.",
          },
          {
            title: "Sharing Controls",
            content:
              "You have granular control over who can access your workspaces and what permissions they have. All sharing is managed through encryption, ensuring that only authorized users can decrypt your content.",
          },
        ],
      },
      {
        id: "children-privacy",
        title: "Children's Privacy",
        icon: <AlertTriangle className="h-6 w-6" />,
        content:
          "Our service is not directed to children under 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information of a child under 16, we will take steps to delete such information as quickly as possible.",
      },
      {
        id: "changes",
        title: "Changes to Privacy Policy",
        icon: <FileText className="h-6 w-6" />,
        content:
          'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.',
      },
    ],
  };

  const toggleSection = (index: number) => {
    if (activeSections.includes(index)) {
      setActiveSections((a) => a.filter((i) => i !== index));
    } else {
      setActiveSections((a) => [...a, index]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70 opacity-90"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-full shadow-lg border border-blue-500/30">
                <Lock className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
              {policyData.pageTitle}
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              {policyData.tagline}
            </p>
            <div className="mt-8 inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-200 text-sm border border-blue-500/20">
              Last updated: {policyData.lastUpdated}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-50">
          <div className="w-64 h-64 rounded-full bg-indigo-600 bg-opacity-30 blur-xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 opacity-50">
          <div className="w-40 h-40 rounded-full bg-blue-600 bg-opacity-30 blur-xl"></div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-800 to-blue-900/50 p-8 rounded-2xl shadow-sm border border-gray-700">
            <div className="flex items-start space-x-6">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-sm border border-blue-500/30">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Our Zero-Knowledge Promise
                </h2>
                <div className="space-y-4">
                  {policyData.introduction.map((paragraph, idx) => (
                    <p key={idx} className="text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 bg-gradient-to-br from-gray-800 to-blue-900/70">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {policyData.sections.map((section, idx) => (
              <div
                key={idx}
                className={`bg-gray-800/80 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200 border ${
                  activeSections.includes(idx)
                    ? "border-blue-500/50 ring-2 ring-blue-500/20"
                    : "border-gray-700 hover:border-blue-600/30"
                }`}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-full ${
                        activeSections.includes(idx)
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {section.title}
                    </h3>
                  </div>
                  <div
                    className={`transform transition-transform ${
                      activeSections.includes(idx) ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className={`px-8 transition-all duration-200 ease-out overflow-hidden ${
                    activeSections.includes(idx)
                      ? "py-6 border-t border-gray-700"
                      : "max-h-0 py-0"
                  }`}
                >
                  <p className="text-gray-300 mb-6">{section.content}</p>

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-6">
                      {section.subsections.map((subsection, subIdx) => (
                        <div
                          key={subIdx}
                          className="bg-gray-700/50 p-6 rounded-xl border border-gray-600"
                        >
                          <h4 className="text-lg font-medium text-white mb-2">
                            {subsection.title}
                          </h4>
                          <p className="text-gray-300">{subsection.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 bg-gradient-to-br from-gray-900 to-blue-900/70">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <Key className="h-6 w-6 text-blue-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Your data belongs to you. Period.
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto">
            At Axiom, we've engineered our platform so that we physically cannot
            compromise your privacy. That's the strongest privacy guarantee
            possible.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/terms"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Terms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
