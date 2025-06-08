import {useState, useContext} from "react";
import {EyeIcon, EyeOffIcon, LockIcon, User} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {UserContext} from "../context/UserContext";
const SignIn = () => {
  const {setUser} = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const BACKENDURL = import.meta.env.VITE_BACKEND;
  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    setFormError("");

    // Basic validation
    if (password.length < 6) {
      setFormError("Please enter a valid password (min 6 characters)");
      setIsSubmitting(false);
      return;
    }
    const Data = {
      username,
      password,
    };
    // Simulate API call
    await axios.post(`${BACKENDURL}/api/signin`, Data).then(function (response) {
      if (response.data.success && response.data.token) {
        Cookies.set("token", response.data.token, {expires: 36500}); // 100 years
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setFormSuccess(true);
        setIsSubmitting(false);
        navigate("/");
      } else {
        setFormError(response.data.message);
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="relative z-10 w-full max-w-md p-4 bg-black/60">
        <div className="space-y-2">
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mx-auto flex items-center justify-center">
              <LockIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter">Sign In</h1>
            <p className="text-zinc-400">Enter your credentials to access your account</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300">
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border-zinc-700 rounded bg-zinc-900/50 text-purple-500 focus:ring-purple-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-zinc-400 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {formError && <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">{formError}</div>}

          {formSuccess && (
            <div className="p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-200 text-sm">
              Successfully signed in with username: {username}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-black text-zinc-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-2 px-4 bg-zinc-900/50 border border-zinc-800 rounded-md text-white hover:bg-zinc-800 transition-colors">Google</button>
            <button className="py-2 px-4 bg-zinc-900/50 border border-zinc-800 rounded-md text-white hover:bg-zinc-800 transition-colors">GitHub</button>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
