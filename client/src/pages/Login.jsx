import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          🔐 Login to ThinkShare
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 font-medium shadow-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className="absolute top-3.5 left-3 text-gray-400">📧</span>
          </div>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 pl-11 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 font-medium shadow-sm"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="absolute top-3.5 left-3 text-gray-400">🔒</span>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-3.5 right-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "🚀 Login"}
          </button>

          {error && (
            <p className="text-center text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
