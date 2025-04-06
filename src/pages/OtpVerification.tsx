import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useVerifyOtp } from "../api/auth";
import { KeyIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { isAxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const otpSchema = z.object({
  otp: z.string().min(4, "OTP must be at least 4 characters").max(6, "OTP must be at most 6 characters"),
});

type OtpFormData = z.infer<typeof otpSchema>;

const OtpVerification: React.FC = () => {
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const verifyOtpMutation = useVerifyOtp();

  // Get email from state passed during navigation
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      setError("Email information is missing. Please go back to the signup page.");
      return;
    }

    setError("");
    try {
      await verifyOtpMutation.mutateAsync({
        email,
        otp: data.otp,
      });
      setIsVerified(true);
      showNotification("success", "OTP verified successfully! Your account is now active.");
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

  const handleContinue = () => {
    navigate("/login");
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">OTP Verification</h1>
          </div>
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-700 mt-4">
            <AlertCircleIcon size={18} />
            <span>Email information is missing. Please go back to the signup page.</span>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Return to Signup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">OTP Verification</h1>
          <p className="mt-2 text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-700 mt-4">
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </div>
        )}

        {isVerified ? (
          <div className="mt-6">
            <div className="bg-green-50 p-6 rounded-md">
              <div className="flex items-center gap-3 text-green-700 mb-4">
                <CheckCircleIcon size={24} />
                <h2 className="text-lg font-medium">Verification Successful</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Your email has been verified successfully. You can now log in to your account.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleContinue}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon size={18} className="text-gray-800" />
                </div>
                <input
                  id="otp"
                  {...register("otp")}
                  type="text"
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter verification code"
                />
              </div>
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:text-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive a code?{" "}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Resend Code
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
