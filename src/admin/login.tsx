import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "123456") {
        localStorage.setItem("token", "logged_in_user");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials. Try: admin@gmail.com / 123456");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* Background decorative orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphic Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-md">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70">Sign in to your admin dashboard</p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/50 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300 backdrop-blur-md"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/50 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300 backdrop-blur-md"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-white text-purple-600 font-semibold py-4 rounded-2xl hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Hint (for demo purposes) */}
            <div className="text-center mt-6">
              <p className="text-white/60 text-sm">
                Demo credentials: <span className="font-mono text-white/90">admin@gmail.com</span> /{" "}
                <span className="font-mono text-white/90">123456</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 mt-8 text-sm">
          © 2025 Admin Panel • Secured Login
        </p>
      </div>
    </div>
  );
}