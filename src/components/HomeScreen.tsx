import { Plus, FileText, Users, Building2, ArrowRight } from "lucide-react";

const HomeScreen = ({ goToForm }: {goToForm: any}) => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/10 to-purple-900/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl w-full text-center space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-up">
          {/* <div className="flex justify-center">
            <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-xl">
              <p className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Next-Gen Construction Management
              </p>
            </div>
          </div> */}

          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
            SUNCITY
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-7xl md:text-9xl">
              PROJECTS
            </span>
          </h1>

          {/* <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Register projects in seconds. Track progress in real-time. 
            Build tomorrow — <span className="text-cyan-400 font-semibold">today</span>.
          </p> */}
        </div>

        {/* Primary CTA Button - Elevated Design */}
        <div className="flex justify-center">
          <button
            onClick={goToForm}
            className="group relative px-12 py-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-500 overflow-hidden"
          >
            {/* Animated Shine */}
            <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />

            <div className="flex items-center gap-4">
              <Plus className="w-10 h-10 group-hover:rotate-90 transition duration-700" strokeWidth={3} />
              <span className="tracking-wider">START NEW REGISTRATION</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition duration-300" />
            </div>
          </button>
        </div>

        {/* Stats Grid - Glass Cards with Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { icon: FileText, label: "Active Projects", value: "142", color: "from-cyan-400 to-blue-500" },
            { icon: Users, label: "Team Members", value: "89+", color: "from-purple-400 to-pink-500" },
            { icon: Building2, label: "Live Sites", value: "12", color: "from-emerald-400 to-teal-500" },
          ].map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-4"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
              />
              
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} p-3 shadow-xl`}>
                <stat.icon className="w-full h-full text-white" strokeWidth={2.5} />
              </div>

              <p className="text-5xl font-black text-white mt-4">{stat.value}</p>
              <p className="text-slate-400 text-lg mt-2 font-medium">{stat.label}</p>

              <div className="mt-4 h-1 w-16 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;