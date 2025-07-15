import { Bell, LogOut, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isLoading, login } = useAuth();

  const loggedinUser = localStorage.getItem("")

  // if () {
    
  // }

  if (isLoading) return null;

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left: Logo or Title */}
      <div className="text-xl font-bold text-gray-700">TaskNest</div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        {/* {user ? console.log("getting user") : console.log("not getting user")}; */}

        {/* TODO: Fix user specific content rendering */}
        {user ? (
          // Logged-in: Show welcome message and logout
          <div className="flex items-center space-x-4">
            {/* Welcome Message */}
            <div className="text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-semibold text-gray-800">
                {user.userName}
              </span>
              !
            </div>

            {/* Logout Button */}
            <a href="/login">
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </a>
          </div>
        ) : (
          // Not logged-in: Show Login / Register
          <div className="flex space-x-3">
            <a
              href="/login"
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <LogIn size={16} />
              <span>Login</span>
            </a>
            <a
              href="/register"
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-md transition-colors"
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
