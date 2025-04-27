import { Shield, Lock, Users, CheckCircle } from "lucide-react";

export default function SecurityArchitectureSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 mb-6">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Private by Design
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Private by Design
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Axiom uses client-side encryption with a unique key for each
              workspace.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20">
                <h3 className="text-lg font-medium text-white">
                  Workspace-Level Security
                </h3>
                <p className="mt-1 text-gray-300">
                  Create separate, secure workspaces for different projects or
                  teams with dedicated encryption keys.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/5 backdrop-blur-sm border border-purple-500/20">
                <h3 className="text-lg font-medium text-white">
                  File-Level Privacy
                </h3>
                <p className="mt-1 text-gray-300">
                  Every file in your workspace is encrypted with the workspace
                  key, ensuring consistent security.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/5 backdrop-blur-sm border border-blue-500/20">
                <h3 className="text-lg font-medium text-white">
                  Granular Permissions
                </h3>
                <p className="mt-1 text-gray-300">
                  Set precise user permissions: view, edit, delete, and manage
                  user access.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-500/5 backdrop-blur-sm border border-blue-500/20">
                <h3 className="text-lg font-medium text-white">
                  Username-Based Sharing
                </h3>
                <p className="mt-1 text-gray-300">
                  Collaborate securely with teammates using just their username
                  - we handle the secure key exchange.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="aspect-w-4 aspect-h-3">
              <div className="w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <div className="text-center">
                  <Shield className="h-16 w-16 mx-auto text-blue-400 mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">
                    Workspace Access Control
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Each workspace has its own encryption key, shared securely
                    with authorized members only.
                  </p>

                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow p-4 border border-gray-700 text-left">
                    <div className="flex justify-between mb-3">
                      <div className="font-medium text-white">
                        Marketing Team
                      </div>
                      <div className="text-sm text-blue-400 flex items-center">
                        <Lock className="h-3 w-3 mr-1" />
                        Encrypted
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-800/70 rounded border border-gray-700">
                        <span className="text-gray-300">user@example.com</span>
                        <span className="bg-green-500/20 text-green-300 px-2 rounded-full text-xs">
                          All Permissions
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-800/70 rounded border border-gray-700">
                        <span className="text-gray-300">
                          teammate@example.com
                        </span>
                        <span className="bg-blue-500/20 text-blue-300 px-2 rounded-full text-xs">
                          Edit, View
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-800/70 rounded border border-gray-700">
                        <span className="text-gray-300">
                          viewer@example.com
                        </span>
                        <span className="bg-gray-700 text-gray-300 px-2 rounded-full text-xs">
                          View Only
                        </span>
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
