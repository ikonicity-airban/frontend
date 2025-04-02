import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LockIcon, MailIcon, AlertCircleIcon } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      showNotification("success", "Login successful! Welcome back.");
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      showNotification("error", "Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Quarterly Staff Evaluation
          </h1>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </div>
        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-700">
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
          <div className="text-sm text-center text-gray-600">
            <p>Demo accounts (password: password):</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEmail("staff@example.com")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => setEmail("lead@example.com")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Team Lead
              </button>
              <button
                type="button"
                onClick={() => setEmail("hr@example.com")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                HR
              </button>
              <button
                type="button"
                onClick={() => setEmail("director@example.com")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Director
              </button>
              <button
                type="button"
                onClick={() => setEmail("admin@example.com")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
