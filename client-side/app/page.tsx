import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      
      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 -mt-24">
        Inventory Management System
      </h1>

      {/* Sub text */}
      <p className="text-[var(--text-muted)] max-w-xl">
        Secure, role-based platform to manage products, users, and inventory.
      </p>

      {/* Login Button (Moved Down) */}
      <div className="mt-12">
        <Link
          href="/login"
          className="px-8 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition"
        >
          Login
        </Link>
      </div>

    </main>
  );
}
