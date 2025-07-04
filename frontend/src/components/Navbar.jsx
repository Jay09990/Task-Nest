import { Bell, LogOut, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ Correct import

const Navbar = () => {
  const { user, logout } = useAuth(); // ✅ Correct hook usage

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left: Logo or Title (optional) */}
      <div className="text-xl font-semibold text-gray-700">
        {/* Can be empty if Sidebar already shows branding */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={20} />
        </button>

        {/* Auth Actions */}
        {user ? (
          // Logged-in: Show avatar + logout
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.name[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          // Not logged-in: Show Login / Register
          <div className="flex space-x-3">
            <a
              href="/login"
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
            >
              <LogIn size={16} />
              <span>Login</span>
            </a>
            <a
              href="/register"
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
            >
              <UserPlus size={16} />
              <span>Register</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
