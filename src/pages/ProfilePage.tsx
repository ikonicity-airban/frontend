import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../api/types";
import { useUpdateUser } from "../api/users";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, BuildingIcon, BadgeIcon, CalendarIcon, UserCogIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateUser, isPending } = useUpdateUser(user?.id || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      position: user?.position || "",
      department: user?.department || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        position: user.position || "",
        department: user.department || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        {/* Profile Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
              <p className="mt-1 text-sm text-gray-500">View and manage your personal information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-md font-medium hover:bg-indigo-50 flex items-center gap-2 transition-all"
              >
                <PencilIcon size={16} />
                Edit Profile
              </button>
            ) : null}
          </div>
        </div>

        {/* User Basic Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <UserIcon size={32} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
              <p className="text-indigo-600 font-medium">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Info Cards */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <UserIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Full Name
                  </label>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      {...register("name")}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">{user.name}</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <MailIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Email
                  </label>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      {...register("email")}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">{user.email}</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <PhoneIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Phone Number
                  </label>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      {...register("phone")}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <MapPinIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Address
                  </label>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      {...register("address")}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.address || "Not provided"}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <BriefcaseIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Position
                  </label>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      {...register("position")}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.position || "Not provided"}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <BuildingIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Department
                  </label>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      {...register("department")}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.department || "Not provided"}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <BadgeIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Employee ID
                  </label>
                </div>
                <p className="text-gray-900 font-medium">
                  {user.employeeId || "Not assigned"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <UserCogIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Role
                  </label>
                </div>
                <p className="text-gray-900 font-medium">{user.role}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <CalendarIcon size={20} className="text-indigo-600" />
                  </div>
                  <label className="font-medium text-gray-700">
                    Hire Date
                  </label>
                </div>
                <p className="text-gray-900 font-medium">
                  {user.hireDate
                    ? new Date(user.hireDate).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <XIcon size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckIcon size={16} />
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
