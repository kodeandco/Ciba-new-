"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get API URL - fallback to localhost if env var not set
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  };

  useEffect(() => {
    setMounted(true);

    // Check if already logged in
    const token = localStorage.getItem("admin-token");
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/verify`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push("/admin/Adminhomep");
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-email");
        localStorage.removeItem("admin-id");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("admin-token");
    }
  };

  const handleLogin = async () => {
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Email validation
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = getApiUrl();
      console.log('🔄 Attempting login to:', `${apiUrl}/api/auth/login`);

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Server returned non-JSON response');
        throw new Error(
          `Server error: Expected JSON but received ${contentType}. ` +
          `The API might not be running at ${apiUrl}`
        );
      }

      const data = await response.json();
      console.log('📦 Response data:', { success: data.success, hasToken: !!data.token });

      if (response.ok && data.success) {
        // Store the JWT token
        localStorage.setItem("admin-token", data.token);

        // Store admin info
        localStorage.setItem("admin-email", data.admin.email);
        localStorage.setItem("admin-id", data.admin.id);

        console.log('✅ Login successful, redirecting...');

        // Redirect to admin panel
        router.push("/admin/Adminhomep");
      } else {
        // Show server error message
        setError(data.error || "Login failed. Please check your credentials.");
        console.error('❌ Login failed:', data.error);
      }
    } catch (error) {
      console.error("❌ Login error:", error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError(
          `Cannot connect to server at ${getApiUrl()}. ` +
          `Please ensure the backend is running on port 5000.`
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/admin/forgot-password");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/dst-ciba-logo.png"
            alt="Logo"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access the admin panel
          </p>
        </div>


        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-sm text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Admin Panel
        </div>
      </div>
    </div>
  );
}