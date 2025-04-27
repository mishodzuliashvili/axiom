"use client";
import { useState } from "react";
import {
  FileText,
  Scale,
  Clock,
  AlertTriangle,
  Layers,
  Globe,
  Server,
  Shield,
  BookOpen,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const termsData = {
    pageTitle: "Terms of Service",
    tagline: "Please read these terms carefully before using Axiom",
    lastUpdated: "April 27, 2025",
    introduction: [
      "Welcome to Axiom. By accessing or using our service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.",
      "Axiom provides a secure, zero-knowledge workspace platform that allows you to store, manage, and share files and information with complete privacy.",
    ],
    sections: [
      {
        id: "account-terms",
        title: "Account Terms",
        icon: <User className="h-6 w-6" />,
        content: "Your account with Axiom is subject to the following terms:",
        subsections: [
          {
            title: "Account Registration",
            content:
              "You must register for an account to access Axiom. You agree to provide accurate and complete information during registration and to keep your account information updated.",
          },
          {
            title: "Account Security",
            content:
              "You are responsible for safeguarding your password and for any activities or actions under your account. Axiom cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.",
          },
          {
            title: "Account Termination",
            content:
              "We reserve the right to suspend or terminate your account if you violate these Terms of Service or if your account shows signs of malicious activity.",
          },
        ],
      },
      {
        id: "service-usage",
        title: "Service Usage",
        icon: <Layers className="h-6 w-6" />,
        content: "Your use of Axiom is subject to the following conditions:",
        subsections: [
          {
            title: "Acceptable Use",
            content:
              "You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use our service for any illegal or unauthorized purpose.",
          },
          {
            title: "Usage Limits",
            content:
              "Different account plans have different usage limits. You agree not to exceed the storage or bandwidth limits of your plan. If you exceed these limits, we may throttle your service or charge you for the excess usage.",
          },
          {
            title: "Prohibited Activities",
            content:
              "You agree not to use Axiom to store or share illegal content, malware, or material that infringes on the intellectual property rights of others. You also agree not to attempt to breach our security measures or disrupt our service.",
          },
        ],
      },
      {
        id: "intellectual-property",
        title: "Intellectual Property",
        icon: <BookOpen className="h-6 w-6" />,
        content:
          "Intellectual property rights related to Axiom are allocated as follows:",
        subsections: [
          {
            title: "Your Content",
            content:
              "You retain all rights to the content you store on Axiom. We claim no intellectual property rights over the materials you provide to the service.",
          },
          {
            title: "Our Content",
            content:
              "The Axiom service, including its design, logos, and software, is protected by copyright, trademark, and other laws. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the service without express permission from us.",
          },
          {
            title: "Feedback",
            content:
              "If you send us feedback or suggestions about our service, we may use them without any obligation to compensate you. We will not use them in a way that violates your confidentiality.",
          },
        ],
      },
      {
        id: "payments",
        title: "Payments and Billing",
        icon: <CreditCard className="h-6 w-6" />,
        content: "Payment terms for paid Axiom accounts are as follows:",
        subsections: [
          {
            title: "Billing Cycle",
            content:
              "Subscription fees are billed in advance on a monthly or annual basis depending on the plan you select. Payment will be charged to your designated payment method at the beginning of your subscription period.",
          },
          {
            title: "Automatic Renewal",
            content:
              "Your subscription will automatically renew unless you cancel it at least 24 hours before the end of the current billing period. You can cancel your subscription at any time from your account settings.",
          },
          {
            title: "Refunds",
            content:
              "Fees are non-refundable except where required by law. Some plans may offer a money-back guarantee for a specific period after subscription.",
          },
        ],
      },
      {
        id: "data-practices",
        title: "Data Practices",
        icon: <Server className="h-6 w-6" />,
        content: "Our handling of your data is guided by these principles:",
        subsections: [
          {
            title: "Zero-Knowledge Design",
            content:
              "Axiom is designed with zero-knowledge architecture, meaning we cannot access the contents of your workspaces or files. All encryption and decryption occurs on your device.",
          },
          {
            title: "Data Protection",
            content:
              "We implement appropriate technical and organizational measures to protect your data.",
          },
          {
            title: "Data Retention",
            content:
              "If you delete your account, we will delete your workspace data within 30 days.",
          },
        ],
      },
      {
        id: "liability",
        title: "Limitation of Liability",
        icon: <Scale className="h-6 w-6" />,
        content: "Our liability to you is limited as follows:",
        subsections: [
          {
            title: "Service Availability",
            content:
              "We do not guarantee that our service will be available, uninterrupted, timely, secure, or error-free. We may suspend or discontinue any part of our service without notice.",
          },
          {
            title: "Indemnification",
            content:
              "You agree to indemnify and hold harmless Axiom and its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the service or violation of these terms.",
          },
          {
            title: "Warranty Disclaimer",
            content:
              "The service is provided 'as is' without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.",
          },
        ],
      },
      {
        id: "changes-termination",
        title: "Changes and Termination",
        icon: <Clock className="h-6 w-6" />,
        content:
          "These terms may change, and the service may terminate as follows:",
        subsections: [
          {
            title: "Modifications to Terms",
            content:
              "We reserve the right to modify these Terms at any time. If we make material changes, we will notify you via email or through the service at least 14 days before the changes take effect.",
          },
          {
            title: "Service Termination",
            content:
              "We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms.",
          },
        ],
      },

      {
        id: "contact",
        title: "Contact Information",
        icon: <Mail className="h-6 w-6" />,
        content:
          "If you have any questions about these Terms, please contact us.",
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
      {/* Hero Section - Matching the dark theme */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70 opacity-90"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-full shadow-lg border border-blue-500/30">
                <FileText className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
              {termsData.pageTitle}
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              {termsData.tagline}
            </p>
            <div className="mt-8 inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-200 text-sm border border-blue-500/20">
              Last updated: {termsData.lastUpdated}
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
                <Scale className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Agreement to Terms
                </h2>
                <div className="space-y-4">
                  {termsData.introduction.map((paragraph, idx) => (
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

      {/* Terms Content */}
      <section className="py-16 bg-gradient-to-br from-gray-800 to-blue-900/70">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {termsData.sections.map((section, idx) => (
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

      {/* Acceptance Banner */}
      <section className="bg-gray-900 py-12 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between border border-blue-700/30">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to start using Axiom?
              </h3>
              <p className="text-blue-200">
                By creating an account, you accept these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 bg-gradient-to-br from-gray-900 to-blue-900/70">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <Shield className="h-6 w-6 text-blue-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Committed to protecting your legal rights
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto">
            These Terms of Service are designed to be fair, transparent, and
            protective of both your rights and ours. If you have any questions,
            our legal team is here to help.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Need to add imports for missing icons
function User(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function CreditCard(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
      <line x1="2" x2="22" y1="10" y2="10"></line>
    </svg>
  );
}

function Mail(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
}
