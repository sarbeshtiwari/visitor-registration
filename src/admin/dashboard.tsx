import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, UserCheck } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    navigate("/login");
  };

  const allMenuItems = [
    {
      title: "Client Management",
      icon: Users,
      path: "/client-management",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      desc: "View and manage all clients",
    },
    {
      title: "Users",
      icon: UserCheck,
      path: "/users",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
      desc: "Administer system users",
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    permissions.includes(item.title)
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-700 rounded-full opacity-40 filter blur-3xl animate-spin-slow"></div>
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-pink-700 rounded-full opacity-40 filter blur-3xl animate-pulse-slow"></div>
      </div>
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center px-8 md:px-16 pt-12 pb-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Admin Dashboard
          </h1>
          <p className="text-white/70 mt-2 text-lg">Welcome back, Admin</p>
        </div>
        <button
          onClick={logout}
          className="mt-6 md:mt-0 flex items-center gap-3 px-6 py-3 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl hover:bg-red-500/30 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </header>
      <main className="relative z-10 px-8 md:px-16 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-white/90">Quick Access</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="relative group cursor-pointer rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div
                className={`${item.gradient} absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-500`}
              ></div>

              <div className="relative p-8 flex flex-col h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>
                <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="text-center py-8 text-white/40 text-sm">
        © 2025 Admin Panel • All systems operational
      </footer>
    </div>
  );
}
