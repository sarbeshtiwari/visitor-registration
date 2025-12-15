import { Plus, FileText, Users, Building2, ArrowRight } from "lucide-react";

const HomeScreen = ({ goToForm }: { goToForm: () => void }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-950" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-20 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            SUNCITY
          </h1>
          <h2 className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-6xl font-black text-transparent md:text-8xl">
            PROJECTS
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Visitor onboarding & project registration system
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={goToForm}
            className="
              group inline-flex items-center gap-5
              rounded-xl border border-indigo-500/30
              bg-gradient-to-r from-indigo-600 to-cyan-600
              px-12 py-6 text-lg font-bold text-white
              shadow-xl shadow-indigo-600/30
              transition-all duration-300
              hover:shadow-cyan-500/40 hover:brightness-110
              active:scale-95
            "
          >
            <Plus className="h-8 w-8 transition-transform group-hover:rotate-90" />
            <span className="tracking-wide">Start New Registration</span>
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: FileText,
              label: "Active Projects",
              value: "142",
              gradient: "from-indigo-500 to-cyan-500",
            },
            {
              icon: Users,
              label: "Team Members",
              value: "89+",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: Building2,
              label: "Live Sites",
              value: "12",
              gradient: "from-emerald-500 to-teal-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="
                group relative overflow-hidden
                rounded-2xl border border-white/10
                bg-white/5 p-8
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-3 hover:border-white/20
              "
            >
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}
              >
                <item.icon className="h-8 w-8 text-white" />
              </div>

              <p className="text-4xl font-extrabold text-white">
                {item.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                {item.label}
              </p>

              <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
        <div className="pt-12">
          <div className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
