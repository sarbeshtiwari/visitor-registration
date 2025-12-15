import { Globe, Shield, Activity } from "lucide-react";

const Footer = ({ ip }: { ip: string }) => {
  return (
    <footer className="w-full bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-slate-400">
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Secure Connection</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700 shadow-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-xs text-cyan-300 uppercase tracking-wider">Your IP</p>
                <p className="font-mono font-bold text-white text-lg truncate">{ip}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs text-cyan-300 uppercase tracking-wider">Session</p>
                <p className="font-semibold text-emerald-300">Active</p>
              </div>
            </div>
          </div>
          <div className="text-slate-500 text-xs mt-3 md:mt-0 text-center md:text-right">
            © 2025 <span className="text-cyan-400 font-semibold">Suncity Projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
