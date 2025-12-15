import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Building2, Calendar, Clock } from "lucide-react";

const TopBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(currentTime, "EEEE, MMMM d, yyyy");
  const formattedTime = format(currentTime, "h:mm:ss a");

  return (
    <div className="w-full bg-slate-950 text-white shadow-lg border-b border-slate-700">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">

          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-cyan-500 blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative p-3 rounded-xl bg-cyan-500 shadow-lg">
                <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-slate-900" />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                SUNCITY PROJECTS
              </h1>
              <p className="text-xs sm:text-sm text-cyan-300 tracking-wider font-medium">
                BUILDING THE FUTURE
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex items-center gap-3 bg-slate-800 bg-opacity-50 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-600 w-full sm:w-auto justify-center">
              <Calendar className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <div className="text-center sm:text-left min-w-0">
                <p className="text-cyan-300 text-xs uppercase tracking-wider">Date</p>
                <p className="font-semibold text-white text-sm sm:text-base truncate">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-800 bg-opacity-50 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-600 w-full sm:w-auto justify-center">
              <Clock className="h-5 w-5 text-cyan-400 animate-spin-slow flex-shrink-0" />
              <div className="text-center sm:text-left min-w-0">
                <p className="text-cyan-300 text-xs uppercase tracking-wider">Time</p>
                <p className="font-semibold text-white tabular-nums text-sm sm:text-base">
                  {formattedTime}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;
