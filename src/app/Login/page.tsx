"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../NavBar";
import Footer from "../footer";
import { useUser } from "../UserContext";

export default function Page() {
  const { setUser } = useUser();
  const router = useRouter();
  const [srn, setSrn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const validateSRN = (value: string) => {
    const trimmed = value.trim();
    const srnRegex = /^PES\d+UG(?:25|26|27)[A-Z]{2,10}\d{3}$/i;
    return srnRegex.test(trimmed);
  };

  const validateEmail = (value: string) => {
    const v = value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(v);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!srn || !email || !password) {
      setError("Please fill in SRN, email and password.");
      return;
    }
    if (!validateSRN(srn)) {
      setError("Please enter a valid SRN (e.g. PES1UG25CSE001).");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ srn, email, password }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setShowSuccessPopup(true);
        console.log("Logged in user:", data.user);
        setTimeout(() => {
          setShowSuccessPopup(false);
          router.push("/");
        }, 3000);
        setUser(data.user);
      } else {
        setError(data.message || "Login failed.");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12 mt-[80px]">
        <div className="w-full max-w-md bg-white/80 dark:bg-neutral-900/80 rounded-lg shadow-md p-6">
          {showSuccessPopup && (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
              Logging in...
            </div>
          )}
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="srn" className="block text-sm font-medium mb-1">
                SRN
              </label>
              <input
                id="srn"
                type="text"
                value={srn}
                onChange={(e) => setSrn(e.target.value)}
                placeholder="PES1UG25CSE001"
                className="w-full px-3 py-2 border rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@pes.edu"
                className="w-full px-3 py-2 border rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="Register" className="text-blue-600 underline">
              Register
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
