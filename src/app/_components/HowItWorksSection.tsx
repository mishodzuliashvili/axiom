import { Lock, Folder, Users } from "lucide-react";

export default function HowItWorksSection() {
  const features = [
    {
      title: "End-to-End Encryption",
      description:
        "Your documents are encrypted with state-of-the-art cryptography. Only you and those you explicitly share with can access your content.",
      icon: <Lock className="h-10 w-10 text-blue-400" />,
      gradient: "from-blue-500/20 to-blue-600/10",
      border: "border-blue-500/30",
    },
    {
      title: "Workspace Collaboration",
      description:
        "Create secure workspaces with granular permission controls and add files. Share access with complete confidence.",
      icon: <Folder className="h-10 w-10 text-purple-400" />,
      gradient: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-500/30",
    },
    {
      title: "Team Permissions",
      description:
        "Invite teammates by username and assign specific permissions including view, edit, delete, and user management rights.",
      icon: <Users className="h-10 w-10 text-green-400" />,
      gradient: "from-green-500/20 to-green-600/10",
      border: "border-green-500/30",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
            <Lock className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-300">
              How It Works
            </span>
          </div>

          <h2 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Security at Every Level
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
          </h2>

          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-300">
            Our unique architecture ensures your data remains private using
            advanced encryption.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 backdrop-blur-sm border ${feature.border}`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-white text-center mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
