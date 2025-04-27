"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  CheckCircle,
  Users,
  Lightbulb,
  GraduationCap,
  School,
  GitMerge,
  Target,
  Clock,
} from "lucide-react";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Project Lead",
      image: "A",
      color: "bg-blue-500",
    },
    {
      name: "Maya Rodriguez",
      role: "Security Architect",
      image: "M",
      color: "bg-purple-500",
    },
    {
      name: "Sam Patel",
      role: "UI/UX Designer",
      image: "S",
      color: "bg-green-500",
    },
    {
      name: "Taylor Kim",
      role: "Backend Developer",
      image: "T",
      color: "bg-red-500",
    },
    {
      name: "Jordan Lee",
      role: "Frontend Developer",
      image: "J",
      color: "bg-indigo-500",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Background elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`transform transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
              <School className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                University Capstone Project
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              About{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Our Journey
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
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              From a university assignment to a revolutionary secure workspace
              platform. Discover the story behind our mission to provide
              privacy-first collaboration tools.
            </p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Our Story */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/30 to-purple-600/10 backdrop-blur-sm border border-purple-500/30 mb-6">
                <GraduationCap className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-300">
                  Our Story
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Academic Roots, Professional Vision
              </h2>
              <div className="space-y-6 text-gray-300">
                <p>
                  Our journey began in the halls of academia as a capstone
                  project supervised by Vasil. What started as a university
                  assignment evolved into a comprehensive solution addressing a
                  critical market gap: truly secure and private collaboration
                  tools.
                </p>
                <p>
                  Under the guidance of our supervising professor, we combined
                  cutting-edge encryption research with intuitive design
                  principles to create a platform that never compromises on
                  security or usability.
                </p>
                <p>
                  After extensive testing and refinement within the academic
                  environment, we recognized the potential impact of our work.
                  We made the decision to bring our solution to organizations
                  and teams who value both seamless collaboration and
                  uncompromising data privacy.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-white">
                      University Backed
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Developed with academic rigor
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-white">
                      Expert Supervised
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Guided by professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Visual Section */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-xl transform rotate-12 z-10 opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-xl transform -rotate-12 z-10 opacity-70"></div>

              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    <School className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">
                    From Classroom to Cloud
                  </h3>
                  <p className="text-gray-400">
                    Our evolution from academic project to enterprise solution
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/30 flex items-center justify-center mr-4">
                      <Lightbulb className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Concept Phase</h4>
                      <p className="text-sm text-gray-400">
                        Initial research and proposal
                      </p>
                    </div>
                    {/* <div className="ml-auto text-xs text-gray-500">2023</div> */}
                  </div>

                  <div className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center mr-4">
                      <GitMerge className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Development</h4>
                      <p className="text-sm text-gray-400">
                        Building core technology
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      Spring 2025
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/30 flex items-center justify-center mr-4">
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Launch</h4>
                      <p className="text-sm text-gray-400">Public release</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      Summer 2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
                <Target className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-300">
                  Our Mission
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Redefining Secure Collaboration
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                We're on a mission to empower teams with collaboration tools
                that never compromise on privacy or security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:bg-gray-800/80 transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Privacy-First
                </h3>
                <p className="text-gray-400">
                  End-to-end encryption and zero-knowledge architecture ensure
                  your data remains exclusively yours.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:bg-gray-800/80 transition-all">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Seamless Collaboration
                </h3>
                <p className="text-gray-400">
                  Work together in real-time without sacrificing the security
                  and privacy of your sensitive information.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:bg-gray-800/80 transition-all">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Enterprise Trust
                </h3>
                <p className="text-gray-400">
                  Built with enterprise-grade security and compliance
                  requirements in mind from day one.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          {/* <div className="mb-24">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
                <Users className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-300">
                  Our Team
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                The Minds Behind the Platform
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                A group of passionate graduate students and security experts
                dedicated to building a better way to collaborate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:bg-gray-800/80 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-14 h-14 rounded-lg ${member.color} text-white text-xl font-bold flex items-center justify-center mr-4`}
                    >
                      {member.image}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-gray-500/20 border border-gray-500/30 flex items-center justify-center text-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Testimonials */}
          {/* <div className="mb-24">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
                <Clock className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-300">
                  Words from Our Supervisor
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6">Academic Endorsement</h2>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold flex items-center justify-center mb-4">
                  DR
                </div>
                <blockquote className="text-xl text-gray-300 italic mb-6">
                  "This team took on an extraordinarily challenging technical
                  problem and delivered a solution that pushes the boundaries of
                  both security and usability. Their work represents the best of
                  what academic research can achieve when focused on real-world
                  applications."
                </blockquote>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Dr. Rebecca Chen
                  </h3>
                  <p className="text-gray-400">Professor of Cybersecurity</p>
                </div>
              </div>
            </div>
          </div> */}

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience Secure Collaboration?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
              Join the growing community of teams and organizations who refuse
              to compromise on privacy or productivity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transform hover:-translate-y-1"
              >
                <Lock className="h-5 w-5 mr-2" />
                Start Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base font-medium text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-lg shadow-black/5 transform hover:-translate-y-1"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
