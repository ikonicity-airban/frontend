import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../api/auth";
import { MailIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { isAxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showNotification } = useNotification();
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    try {
      await forgotPasswordMutation.mutateAsync({
        email: data.email,
      });
      setIsSubmitted(true);
      showNotification("success", "Password reset instructions sent to your email.");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your email to receive password reset instructions
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
                <h2 className="text-lg font-medium">Email Sent</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We've sent password reset instructions to your email address. Please check your inbox and follow the instructions to reset your password.
              </p>
              <p className="text-gray-700 mb-4">
                If you don't receive an email within a few minutes, please check your spam folder or try again.
              </p>
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon size={18} className="text-gray-800" />
                </div>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:text-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Instructions"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create Account
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
