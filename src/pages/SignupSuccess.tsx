import React, { useState, useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { useRequestOtp } from "../api/auth";
import { CheckCircleIcon, MailIcon, RefreshCwIcon } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { isAxiosError } from "axios";

const SignupSuccess: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  const { showNotification } = useNotification();
  const requestOtpMutation = useRequestOtp();
  
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  
  // If no email is provided in location state, redirect to signup
  if (!email) {
    return <Navigate to="/signup" replace />;
  }
  
  useEffect(() => {
    // Start countdown only when resend is disabled
    let timer: NodeJS.Timeout;
    
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 300; // Reset to 5 minutes
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendDisabled]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleResendEmail = async () => {
    try {
      await requestOtpMutation.mutateAsync({ email });
      showNotification("success", "Verification email has been resent. Please check your inbox.");
      setResendDisabled(true);
    } catch (error) {
      let errorMessage = "";
      if (isAxiosError(error)) {
        errorMessage =
          error?.response?.data.message.message ??
          error?.response?.data.message ??
          error.message;
      } else {
        errorMessage = "Failed to resend verification email.";
      }
      showNotification("error", errorMessage);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Account Created!</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification email to <span className="font-medium text-indigo-600">{email}</span>
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <MailIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Verification Required</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Please check your email and click the verification link or enter the OTP code to activate your account.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleResendEmail}
            disabled={resendDisabled || requestOtpMutation.isPending}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md ${
              resendDisabled || requestOtpMutation.isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <RefreshCwIcon className={`h-5 w-5 ${resendDisabled ? "text-gray-400" : "text-indigo-500 group-hover:text-indigo-400"}`} />
            </span>
            {requestOtpMutation.isPending ? (
              "Sending..."
            ) : resendDisabled ? (
              `Resend in ${formatTime(countdown)}`
            ) : (
              "Resend Verification Email"
            )}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already verified?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm">
            <Link to="/otp-verification" state={{ email }} className="font-medium text-indigo-600 hover:text-indigo-500">
              Enter OTP code
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
