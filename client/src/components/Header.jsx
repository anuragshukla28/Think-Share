import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-wide drop-shadow">
          Think<span className="text-yellow-300">Share</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-5 text-sm sm:text-base font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative pb-1 transition hover:text-yellow-200 ${
                isActive ? "text-yellow-300 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-yellow-300" : ""
              }`
            }
          >
            Home
          </NavLink>

          {user && (
            <NavLink
              to="/articles"
              className={({ isActive }) =>
                `relative pb-1 transition hover:text-yellow-200 ${
                  isActive ? "text-yellow-300 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-yellow-300" : ""
                }`
              }
            >
              Articles
            </NavLink>
          )}

          {user && (
            <button
              onClick={() => navigate("/article/create")}
              className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-full shadow hover:bg-blue-100 transition"
            >
              + Share
            </button>
          )}

          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `transition hover:text-yellow-200 ${
                    isActive ? "text-yellow-300 font-semibold underline" : ""
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `transition hover:text-yellow-200 ${
                    isActive ? "text-yellow-300 font-semibold underline" : ""
                  }`
                }
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `transition hover:text-yellow-200 ${
                    isActive ? "text-yellow-300 font-semibold underline" : ""
                  }`
                }
              >
                {user.fullName}
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-full shadow hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
