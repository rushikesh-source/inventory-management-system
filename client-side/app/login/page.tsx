"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔓 Decode JWT to get payload
  const decodeToken = (token: string) => {
    try {
      const payload = token.split(".")[1]; // middle part
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (err) {
      console.error("TOKEN DECODE ERROR:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("FULL LOGIN RESPONSE:", res.data);

      // 🔐 Your backend returns token inside data.access_token
      const accessToken = res?.data?.data?.access_token;

      if (!accessToken) {
        console.error("ACCESS TOKEN NOT FOUND:", res.data);
        setError("Access token not received from server");
        return;
      }

      // Save token
      localStorage.setItem("token", accessToken);

      // Decode token to get role
      const decoded = decodeToken(accessToken);

      if (!decoded || !decoded.role) {
        console.error("ROLE NOT FOUND IN TOKEN:", decoded);
        setError("User role not found from token");
        return;
      }

      const role = decoded.role.toUpperCase();
      const name=decoded.name.toUpperCase()
      console.log("FINAL USER ROLE:", role);
      
      console.log("decoded.name",decoded.name);
      

      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      

      //  role base access (after login user navigate his dashboard)

      if (role === "SUPER_ADMIN") router.push("/dashboard/super-admin");
      else if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "MANAGER") router.push("/dashboard/manager");
      else if (role === "STAFF") router.push("/dashboard/staff");
      else if (role === "USER") router.push("/dashboard/users");
      else {
        console.error("UNKNOWN ROLE:", role);
        setError("Unauthorized role");
      }
      
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 -mt-24">
        Inventory Management System
      </h1>

      <p className="text-[var(--text-muted)] mb-10">
        Secure access to your dashboard
      </p>

      <div className="bg-[var(--bg-secondary)] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-blue-700 px-4 py-2 rounded-lg text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-blue-700 px-4 py-2 rounded-lg text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
