import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useResetPassword } from "../api/auth";
import { LockIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { isAxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }
    setToken(tokenParam);
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    setError("");
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setIsSubmitted(true);
      showNotification("success", "Password reset successful! You can now log in with your new password.");
    } catch (error) {
      let errorMessage = "";
      if (isAxiosError(error)) {
        errorMessage =
          error?.response?.data.message.message ??
          error?.response?.data.message ??
          error.message;
      } else {
        errorMessage = "Something went wrong.";
      }
      setError(errorMessage);
      showNotification("error", errorMessage);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (!token && !isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          </div>
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-700">
            <AlertCircleIcon size={18} />
            <span>{error || "Invalid or missing reset token. Please request a new password reset link."}</span>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-700">
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 p-6 rounded-md">
              <div className="flex items-center gap-3 text-green-700 mb-4">
                <CheckCircleIcon size={24} />
                <h2 className="text-lg font-medium">Password Reset Successful</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon size={18} className="text-gray-800" />
                  </div>
                  <input
                    id="newPassword"
                    {...register("newPassword")}
                    type="password"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter new password"
                  />
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon size={18} className="text-gray-800" />
                  </div>
                  <input
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    type="password"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm new password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:text-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {resetPasswordMutation.isPending ? "Resetting Password..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
