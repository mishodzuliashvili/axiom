import Link from "next/link";

export default function CallToActionSection() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Ready to secure your workspace?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
          Join users who trust Axiom for their sensitive files and
          collaboration.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition"
          >
            Create Free Account
          </Link>
        </div>
        <p className="mt-4 text-sm text-blue-100">
          No credit card required. Get started in seconds.
        </p>
      </div>
    </section>
  );
}
