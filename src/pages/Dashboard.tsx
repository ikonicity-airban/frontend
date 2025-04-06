import React from "react";
import { useAuth } from "../context/AuthContext";
import StaffDashboard from "../components/dashboard/StaffDashboard";
import TeamLeadDashboard from "../components/dashboard/TeamLeadDashboard";
import HRDashboard from "../components/dashboard/HRDashboard";
import DirectorDashboard from "../components/dashboard/DirectorDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import { UserRoles } from "../lib/roles";
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // Render different dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case UserRoles.STAFF:
        return <StaffDashboard />;
      case UserRoles.LEAD:
        return <TeamLeadDashboard />;
      case UserRoles.HR:
        return <HRDashboard />;
      case UserRoles.DIRECTOR:
        return <DirectorDashboard />;
      case UserRoles.ADMIN:
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user?.role === UserRoles.ADMIN ? "Admin Dashboard" : "My Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {user?.role === UserRoles.STAFF &&
            "Track your evaluations and performance reviews"}
          {user?.role === UserRoles.LEAD && "Manage your team's evaluations"}
          {user?.role === UserRoles.HR && "Review and process evaluations"}
          {user?.role === UserRoles.DIRECTOR &&
            "Make final decisions on evaluations"}
          {user?.role === UserRoles.ADMIN && "Manage the evaluation system"}
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
};
export default Dashboard;
