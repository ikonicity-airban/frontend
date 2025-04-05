import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboardIcon,
  ClipboardCheckIcon,
  UsersIcon,
  SettingsIcon,
  BarChartIcon,
  UserCogIcon,
  UserIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../lib/roles";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRoles[];
}
const Sidebar: React.FC = () => {
  const { user } = useAuth();
  console.log("🚀 ~ user:", user);
  const location = useLocation();
  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboardIcon size={20} />,
      roles: [
        UserRoles.STAFF,
        UserRoles.LEAD,
        UserRoles.HR,
        UserRoles.DIRECTOR,
        UserRoles.ADMIN,
      ],
    },
    {
      name: "Evaluations",
      path: "/evaluation/new",
      icon: <ClipboardCheckIcon size={20} />,
      roles: [
        UserRoles.STAFF,
        UserRoles.LEAD,
        UserRoles.HR,
        UserRoles.DIRECTOR,
      ],
    },
    {
      name: "Team Members",
      path: "/team",
      icon: <UsersIcon size={20} />,
      roles: [
        UserRoles.LEAD,
        UserRoles.HR,
        UserRoles.DIRECTOR,
        UserRoles.ADMIN,
      ],
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserIcon size={20} />,
      roles: [
        UserRoles.STAFF,
        UserRoles.LEAD,
        UserRoles.HR,
        UserRoles.DIRECTOR,
        UserRoles.ADMIN,
      ],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChartIcon size={20} />,
      roles: [UserRoles.HR, UserRoles.DIRECTOR, UserRoles.ADMIN],
    },
    {
      name: "User Management",
      path: "/users",
      icon: <UserCogIcon size={20} />,
      roles: [UserRoles.ADMIN],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <SettingsIcon size={20} />,
      roles: [UserRoles.ADMIN],
    },
  ];
  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  );
  return (
    <div className="bg-indigo-800 text-white w-64 flex-shrink-0">
      <div className="h-16 flex items-center px-6">
        <div className="text-xl font-bold">Staff Evaluation</div>
      </div>
      <nav className="mt-5 px-3">
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md 
                  ${isActive
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
export default Sidebar;
