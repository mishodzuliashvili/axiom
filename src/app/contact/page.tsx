"use client";

import { useState } from "react";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { sendEmail } from "./_actions/sendEmail";

// Form validation types
type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

// Server action function type
type SendEmailAction = (
  formData: FormData
) => Promise<{ success: boolean; message: string }>;

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate useEffect for isLoaded state like in HeroSection
  useState(() => {
    setIsLoaded(true);
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      await sendEmail(formState);
      setFormStatus("success");
      setFormMessage(
        "Your message has been sent successfully. We will get back to you soon!"
      );
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setFormStatus("error");
      setFormMessage(
        "There was an error sending your message. Please try again later."
      );
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
              <Mail className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Get In Touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Let's Start a{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Conversation
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

            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Have questions about our platform? We're here to help. Reach out
              to our team for support, inquiries, or to schedule a demo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div
              className={`transform transition-all duration-1000 ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Send Us a Message
                </h2>

                {formStatus === "success" ? (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-400 text-lg mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-300">{formMessage}</p>
                    </div>
                  </div>
                ) : formStatus === "error" ? (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 flex items-start mb-6">
                    <XCircle className="h-6 w-6 text-red-400 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-400 text-lg mb-2">
                        Something went wrong
                      </h3>
                      <p className="text-gray-300">{formMessage}</p>
                    </div>
                  </div>
                ) : null}

                {(formStatus === "idle" ||
                  formStatus === "error" ||
                  formStatus === "submitting") && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formState.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formState.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Write your message here..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className={`inline-flex items-center justify-center px-8 py-4 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1 w-full ${
                        formStatus === "submitting"
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {formStatus === "submitting" ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                      By submitting this form, you agree to our{" "}
                      <Link
                        target="_blank"
                        href="/privacy"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        target="_blank"
                        href="/terms"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Terms of Service
                      </Link>
                      .
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="h-full flex flex-col">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                        <Mail className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1">
                          Email Us
                        </h3>
                        <p className="text-gray-300">
                          <a
                            href="mailto:support@axiom.com"
                            className="hover:text-blue-400 transition-colors"
                          >
                            support@axiom.com
                          </a>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          We'll respond within 24 hours
                        </p>
                      </div>
                    </div>

                    {/* <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                        <Phone className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1">
                          Call Us
                        </h3>
                        <p className="text-gray-300">
                          <a
                            href="tel:+1-800-123-4567"
                            className="hover:text-blue-400 transition-colors"
                          >
                            +1 (800) 123-4567
                          </a>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Mon-Fri from 9am to 6pm EST
                        </p>
                      </div>
                    </div> */}

                    {/* <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1">
                          Visit Us
                        </h3>
                        <p className="text-gray-300">
                          123 Innovation Drive
                          <br />
                          San Francisco, CA 94103
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          By appointment only
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl shadow-2xl overflow-hidden border border-blue-700/30 backdrop-blur-xl p-8 flex-grow">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Frequently Asked Questions
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-blue-300 text-lg mb-2">
                        How secure is your platform?
                      </h3>
                      <p className="text-gray-300">
                        Our platform uses end-to-end encryption with
                        zero-knowledge architecture, ensuring that only you and
                        your authorized team members can access your data.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-blue-300 text-lg mb-2">
                        Can I try before I buy?
                      </h3>
                      <p className="text-gray-300">
                        Absolutely! We offer access to some features. No credit
                        card required to get started.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-blue-300 text-lg mb-2">
                        Do you offer enterprise solutions?
                      </h3>
                      <p className="text-gray-300">
                        Currently we still developing platform. Contact our team
                        for details.
                      </p>
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
