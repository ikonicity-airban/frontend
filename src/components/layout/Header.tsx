import React from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Quarterly Staff Evaluation
            </h1>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Logout</span>
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
