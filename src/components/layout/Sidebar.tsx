import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboardIcon,
  ClipboardCheckIcon,
  UsersIcon,
  SettingsIcon,
  BarChartIcon,
  UserCogIcon,
  ServerIcon,
  CalendarIcon,
  ActivityIcon,
  DownloadIcon,
  ClipboardListIcon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../lib/roles";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRoles[];
  matchPaths?: string[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
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
      path: "/evaluations",
      icon: <ClipboardCheckIcon size={20} />,
      roles: [
        UserRoles.STAFF,
        UserRoles.LEAD,
        UserRoles.HR,
        UserRoles.DIRECTOR,
      ],
      matchPaths: ["/evaluations", "/evaluation/"],
    },
    {
      name: "Team Members",
      path: "/teams",
      icon: <UsersIcon size={20} />,
      roles: [
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
      name: "Activity Log",
      path: "/activity",
      icon: <ActivityIcon size={20} />,
      roles: [UserRoles.ADMIN],
    },
    {
      name: "Timeline",
      path: "/timeline",
      icon: <CalendarIcon size={20} />,
      roles: [UserRoles.ADMIN],
    },
    {
      name: "Forms",
      path: "/forms",
      icon: <ClipboardListIcon size={20} />,
      roles: [UserRoles.ADMIN],
    },
    {
      name: "Export Reports",
      path: "/export",
      icon: <DownloadIcon size={20} />,
      roles: [UserRoles.ADMIN],
    },
    {
      name: "System Health",
      path: "/system",
      icon: <ServerIcon size={20} />,
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
    <div className="bg-indigo-800 text-white w-64 flex-shrink-0 h-full overflow-y-auto">
      <div className="h-16 flex items-center px-6">
        <div className="text-xl font-bold">Staff Evaluation</div>
      </div>
      <nav className="mt-5 px-3 pb-10">
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            // Check if current path matches exactly or is a sub-path
            const isActive = item.matchPaths
              ? item.matchPaths.some((path) => location.pathname.startsWith(path))
              : location.pathname === item.path;

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
