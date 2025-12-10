import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Download, X, Calendar, User, Mail, Phone, MapPin, 
  Building, IndianRupee, Eye, Home,
  Briefcase, CreditCard, Users, StickyNote
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadharLast4?: string;
  project: string;
  location: string;
  address: string;
  occupation: string;
  budget: string;
  referral: "no" | "broker" | "other";
  brokerName?: string;
  brokerPhone?: string;
  brokerId?: string;
  otherName?: string;
  otherPhone?: string;
  otherRelation?: string;
  notes?: string;
  photoUrl?: string;
  registrationDate: string;
  leadType: string;
}

// Dummy data with realistic photos
const dummyUsers: User[] = Array.from({ length: 35 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Client ${i + 1}`,
  email: `client${i + 1}@example.com`,
  phone: `98${Math.floor(100000000 + Math.random() * 900000000)}`,
  aadharLast4: `${Math.floor(1000 + Math.random() * 9000)}`,
  project: ["Green Acres", "Sunshine Heights", "Skyline Apartments", "River View"][i % 4],
  location: ["Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad"][i % 5],
  address: `${i + 101}, ${["Andheri", "Kormangala", "Baner", "Gurgaon"][i % 4]} West, ${["Mumbai", "Bangalore", "Pune", "Delhi"][i % 4]}`,
  occupation: ["Engineer", "Doctor", "Business Owner", "IT Professional", "Architect"][i % 5],
  budget: ["50-75L", "75-1Cr", "1-1.5Cr", "1.5-2Cr", "2Cr+"][i % 5],
  referral: ["no", "broker", "other"][i % 3] as any,
  brokerName: i % 3 === 1 ? `Rajesh Sharma ${i}` : "",
  brokerPhone: i % 3 === 1 ? `91234${56789 + i}` : "",
  brokerId: i % 3 === 1 ? `BRK${1000 + i}` : "",
  otherName: i % 3 === 2 ? `Priya Mehta` : "",
  otherPhone: i % 3 === 2 ? `98765${43210 + i}` : "",
  otherRelation: i % 3 === 2 ? "Friend" : "",
  notes: i % 7 === 0 ? "Hot lead - Ready to book site visit next week" : "",
  photoUrl: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${(i % 50) + 1}.jpg`,
  registrationDate: new Date(Date.now() - i * 86400000 * Math.floor(Math.random() * 10)).toISOString(),
  leadType: ["Direct", "Broker", "Referral"][i % 3],
}));

export default function UsersList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOption, setExportOption] = useState<"today" | "date">("today");
  const [exportDate, setExportDate] = useState("");

  const usersPerPage = 10;

  const filteredUsers = useMemo(() => {
    return dummyUsers.filter(user =>
      Object.values(user).some(val =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleExport = () => {
    let exportUsers: User[] = [];
    const today = new Date();

    if (exportOption === "today") {
      exportUsers = filteredUsers.filter(u => {
        const d = new Date(u.registrationDate);
        return d.toDateString() === today.toDateString();
      });
    } else if (exportOption === "date" && exportDate) {
      const selected = new Date(exportDate);
      exportUsers = filteredUsers.filter(u => {
        const d = new Date(u.registrationDate);
        return d.toDateString() === selected.toDateString();
      });
    }

    if (exportUsers.length === 0) {
      alert("No users found for the selected date.");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Project", "Location", "Budget", "Lead Type", "Full Address", "Occupation", "Aadhar Last 4", "Date"];
    const rows = exportUsers.map(u => [
      u.name, u.email, u.phone, u.project, u.location, u.budget, u.leadType, u.address, u.occupation, u.aadharLast4,
      new Date(u.registrationDate).toLocaleDateString()
    ]);

    const csv = "data:text/csv;charset=utf-8," + 
       [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `users_${exportOption === "today" ? "today" : exportDate}.csv`);
    link.click();
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-800 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-800 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 md:p-10">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Registered Users
          </h1>
          <p className="text-white/60 mt-2">Complete client database with detailed information</p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search anything... (name, phone, project, broker, notes, etc.)"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:border-cyan-400 transition-all placeholder-white/40"
            />
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl hover:scale-105 transition-all shadow-xl font-medium"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold">Photo</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold">Project</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold">Budget</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold">Lead Type</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    <td className="px-6 py-5">
                      <img src={user.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20" />
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-white/60">ID: #{user.id.padStart(4, '0')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm">
                        <p>{user.phone}</p>
                        <p className="text-white/60">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium">{user.project}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {user.budget}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.leadType === "Direct" ? "bg-blue-500/30 text-blue-300" :
                        user.leadType === "Broker" ? "bg-purple-500/30 text-purple-300" :
                        "bg-emerald-500/30 text-emerald-300"
                      }`}>
                        {user.leadType}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/70">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:scale-110 transition-all font-medium text-sm shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-2 p-6 bg-white/5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-xl font-medium transition-all ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={e => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-b from-slate-900/90 to-transparent backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center z-1">
                <div>
                  <h2 className="text-4xl font-bold">{selectedUser.name}</h2>
                  <p className="text-cyan-400">Lead ID: #{selectedUser.id.padStart(4, '0')} • {selectedUser.leadType} Lead</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  <div className="md:col-span-1">
                    <img src={selectedUser.photoUrl} alt="" className="w-full rounded-2xl shadow-2xl" />
                    {selectedUser.notes && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-2xl">
                        <p className="text-amber-300 flex items-start gap-3">
                          <StickyNote className="w-5 h-5 mt-0.5" />
                          <span className="font-medium">{selectedUser.notes}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {[
                            { icon: User, label: "Full Name", value: selectedUser.name },
                            { icon: Mail, label: "Email", value: selectedUser.email },
                            { icon: Phone, label: "Phone", value: selectedUser.phone },
                            { icon: CreditCard, label: "Aadhar Last 4", value: selectedUser.aadharLast4 || "—", mono: true },
                            { icon: Building, label: "Project", value: selectedUser.project },
                            { icon: MapPin, label: "Location", value: selectedUser.location },
                            { icon: Home, label: "Full Address", value: selectedUser.address },
                            { icon: Briefcase, label: "Occupation", value: selectedUser.occupation },
                            { icon: IndianRupee, label: "Budget Range", value: selectedUser.budget },
                            { icon: Calendar, label: "Registered On", value: new Date(selectedUser.registrationDate).toLocaleString() },
                          ].map((item, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0">
                              <td className="px-6 py-5 w-10">
                                <item.icon className="w-5 h-5 text-cyan-400" />
                              </td>
                              <td className="px-6 py-5 text-white/70 font-medium">{item.label}</td>
                              <td className={`px-6 py-5 font-medium ${item.mono ? "font-mono text-cyan-300" : ""}`}>
                                {item.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {selectedUser.referral !== "no" && (
                      <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                          <Users className="w-6 h-6" />
                          Referral Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {selectedUser.referral === "broker" && (
                            <>
                              <div><span className="text-white/70">Broker Name:</span> <strong>{selectedUser.brokerName}</strong></div>
                              <div><span className="text-white/70">Broker Phone:</span> <strong>{selectedUser.brokerPhone}</strong></div>
                              <div><span className="text-white/70">Broker ID:</span> <strong className="font-mono text-cyan-300">{selectedUser.brokerId}</strong></div>
                            </>
                          )}
                          {selectedUser.referral === "other" && (
                            <>
                              <div><span className="text-white/70">Referred By:</span> <strong>{selectedUser.otherName}</strong></div>
                              <div><span className="text-white/70">Phone:</span> <strong>{selectedUser.otherPhone}</strong></div>
                              <div><span className="text-white/70">Relation:</span> <strong>{selectedUser.otherRelation}</strong></div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showExportModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-6">Export Data</h3>
              <div className="space-y-5">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" checked={exportOption === "today"} onChange={() => setExportOption("today")} className="w-5 h-5" />
                  <span>Today's Registrations Only</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" checked={exportOption === "date"} onChange={() => setExportOption("date")} className="w-5 h-5" />
                  <span>Select Specific Date</span>
                </label>
                {exportOption === "date" && (
                  <input type="date" value={exportDate} onChange={e => setExportDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 focus:border-cyan-400 outline-none" />
                )}
                <div className="flex gap-4 justify-end pt-4">
                  <button onClick={() => setShowExportModal(false)} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20">Cancel</button>
                  <button onClick={handleExport} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl hover:scale-105">Export CSV</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}