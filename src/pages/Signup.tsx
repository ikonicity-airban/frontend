import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignup, useRequestOtp } from "../api/auth";
import { LockIcon, MailIcon, UserIcon, AlertCircleIcon, ArrowRightIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { isAxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Step 1: Basic Information Schema
const basicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

// Step 2: Contact Information Schema
const contactInfoSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required"),
});

// Step 3: Security Information Schema
const securityInfoSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
type SecurityInfoFormData = z.infer<typeof securityInfoSchema>;

// Combined form data type
type SignupFormData = BasicInfoFormData & ContactInfoFormData & SecurityInfoFormData;

const Signup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const signupMutation = useSignup();
  const requestOtpMutation = useRequestOtp();

  // Form for Step 1: Basic Information
  const {
    register: registerBasic,
    handleSubmit: handleSubmitBasic,
    formState: { errors: errorsBasic },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
    },
  });

  // Form for Step 2: Contact Information
  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    formState: { errors: errorsContact },
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phone: formData.phone || "+234",
      address: formData.address || "",
    },
  });

  // Form for Step 3: Security Information
  const {
    register: registerSecurity,
    handleSubmit: handleSubmitSecurity,
    formState: { errors: errorsSecurity },
  } = useForm<SecurityInfoFormData>({
    resolver: zodResolver(securityInfoSchema),
  });

  const onSubmitBasicInfo = (data: BasicInfoFormData) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const onSubmitContactInfo = (data: ContactInfoFormData) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };

  const onSubmitSecurityInfo = async (data: SecurityInfoFormData) => {
    setError("");
    const completeFormData = { ...formData, ...data } as SignupFormData;
    
    try {
      // First, create the user account
      await signupMutation.mutateAsync({
        name: completeFormData.name,
        email: completeFormData.email,
        phone: completeFormData.phone,
        address: completeFormData.address,
        password: completeFormData.password,
      });
      
      // Then, request OTP verification
      await requestOtpMutation.mutateAsync({
        email: completeFormData.email,
      });
      
      showNotification("success", "Account created! Please verify your email with the OTP code.");
      
      // Navigate to signup success page
      navigate("/signup-success", { 
        state: { email: completeFormData.email } 
      });
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

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Progress bar calculation
  const progressPercentage = ((currentStep - 1) / 2) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Step {currentStep} of 3</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-700 mt-4">
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <form className="mt-6" onSubmit={handleSubmitBasic(onSubmitBasicInfo)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-gray-800" />
                  </div>
                  <input
                    id="name"
                    {...registerBasic("name")}
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your full name"
                  />
                </div>
                {errorsBasic.name && (
                  <p className="mt-1 text-sm text-red-600">{errorsBasic.name.message}</p>
                )}
              </div>
              
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
                    {...registerBasic("email")}
                    type="email"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Email address"
                  />
                </div>
                {errorsBasic.email && (
                  <p className="mt-1 text-sm text-red-600">{errorsBasic.email.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
                <ArrowRightIcon size={16} className="ml-2" />
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
        
        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <form className="mt-6" onSubmit={handleSubmitContact(onSubmitContactInfo)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon size={18} className="text-gray-800" />
                  </div>
                  <input
                    id="phone"
                    {...registerContact("phone")}
                    type="tel"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+234 8012345678"
                  />
                </div>
                {errorsContact.phone && (
                  <p className="mt-1 text-sm text-red-600">{errorsContact.phone.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Nigerian format: +234 followed by your number</p>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon size={18} className="text-gray-800" />
                  </div>
                  <textarea
                    id="address"
                    {...registerContact("address")}
                    rows={3}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your address"
                  />
                </div>
                {errorsContact.address && (
                  <p className="mt-1 text-sm text-red-600">{errorsContact.address.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
                <ArrowRightIcon size={16} className="ml-2" />
              </button>
            </div>
          </form>
        )}
        
        {/* Step 3: Security Information */}
        {currentStep === 3 && (
          <form className="mt-6" onSubmit={handleSubmitSecurity(onSubmitSecurityInfo)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon size={18} className="text-gray-800" />
                  </div>
                  <input
                    id="password"
                    {...registerSecurity("password")}
                    type="password"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Create a password"
                  />
                </div>
                {errorsSecurity.password && (
                  <p className="mt-1 text-sm text-red-600">{errorsSecurity.password.message}</p>
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
                    {...registerSecurity("confirmPassword")}
                    type="password"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm your password"
                  />
                </div>
                {errorsSecurity.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsSecurity.confirmPassword.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={signupMutation.isPending || requestOtpMutation.isPending}
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:text-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {signupMutation.isPending || requestOtpMutation.isPending ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
