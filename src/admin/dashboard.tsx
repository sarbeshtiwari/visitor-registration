import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Users, 
  UserCheck, 
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Client Management",
      icon: Users,
      path: "/client-management",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br",
      desc: "View and manage all clients"
    },
    {
      title: "User Management",
      icon: UserCheck,
      path: "/users",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br",
      desc: "Administer system users"
    },
    // {
    //   title: "Analytics",
    //   icon: BarChart3,
    //   path: "/analytics",
    //   color: "from-emerald-500 to-teal-500",
    //   gradient: "bg-gradient-to-br",
    //   desc: "Reports and insights"
    // },
    // {
    //   title: "Security",
    //   icon: Shield,
    //   path: "/security",
    //   color: "from-orange-500 to-red-500",
    //   gradient: "bg-gradient-to-br",
    //   desc: "Access control & logs"
    // }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 md:p-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Admin Dashboard
            </h1>
            <p className="text-white/60 mt-3 text-lg">Welcome back, Admin</p>
          </div>

          <button
            onClick={logout}
            className="mt-6 md:mt-0 flex items-center gap-3 px-6 py-4 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl hover:bg-red-500/30 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="px-8 md:px-12 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Clients", value: "1,248", change: "+12%", icon: Users },
              { label: "Today's Clients", value: "892", change: "+8%", icon: Activity },
              // { label: "Revenue", value: "$48.2k", change: "+23%", icon: TrendingUp },
              // { label: "Growth Rate", value: "87%", change: "+5%", icon: BarChart3 }
            ].map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-white/60" />
                  <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Menu Grid */}
        <div className="px-8 md:px-12 pb-12">
          <h2 className="text-3xl font-bold mb-8 text-white/90">Quick Access</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="group relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 ${item.gradient} ${item.color} opacity-70 group-hover:opacity-90 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-8 flex flex-col h-full">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>

                  {/* Arrow */}
                  <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-white/40 text-sm">
          © 2025 Admin Panel • All systems operational
        </div>
      </div>
    </div>
  );
}