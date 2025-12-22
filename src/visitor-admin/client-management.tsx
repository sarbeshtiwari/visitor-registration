import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  DownloadCloud
} from "lucide-react";

interface Visitor {
  id: number;
  referral: "direct" | "broker";
  brokerName?: string;
  brokerPhone?: string;
  brokerId?: string;
  directSource?: string;
  directSourceOthers?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  cityOther?: string;
  pincode: string;
  projectConfig?: string;
  projectDuration?: string;
  notes?: string;
  ip?: string;
  otpVerified?: boolean;
  submittedAt?: string;
}

export default function VisitorUsersList() {
  const [users, setUsers] = useState<Visitor[]>([]);
  const [selectedUser, setSelectedUser] = useState<Visitor | null>(null);
  const [search, setSearch] = useState("");
  const [exportModal, setExportModal] = useState(false);
  const [exportDate, setExportDate] = useState("");
  const [exportType, setExportType] = useState<"today" | "date">("today");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "declaration">("info");

  const USERS_PER_PAGE = 12;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://sar.ecis.in/api/suncity/visitor");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter(u =>
      [
        u.name,
        u.email,
        u.phone,
        u.referral,
        u.brokerName,
      ]
        .filter(Boolean)
        .some(v => v!.toLowerCase().includes(q))
    );
  }, [search, users]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginated = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  const handleExport = () => {
    let exportList = users;
    if (exportType === "today") {
      const today = new Date().toISOString().split("T")[0];
      exportList = users.filter(
        u => (u.submittedAt || "").startsWith(today)
      );
    } else if (exportDate) {
      exportList = users.filter(
        u => (u.submittedAt || "").startsWith(exportDate)
      );
    }

    if (exportList.length === 0) {
      alert("No visitors found for the selected date.");
      return;
    }

    const headers = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Referral",
        "Direct Source",
        "Direct Source Others",
        "Broker Name",
        "Broker Phone",
        "Broker Company",
        "City",
        "City Other",
        "Pincode",
        "Project Config",
        "Project Duration",
        "OTP Verified",
        "IP",
        "Submitted At",
      ].join(",")
    ];

    const rows = exportList.map(v =>
      [
        v.id,
        v.name,
        v.email,
        v.phone,
        v.referral,
        v.directSource || "",
        v.directSourceOthers || "",
        v.brokerName || "",
        v.brokerPhone || "",
        v.brokerId || "",
        v.city,
        v.cityOther || "",
        v.pincode,
        v.projectConfig || "",
        v.projectDuration || "",
        v.otpVerified ? "Yes" : "No",
        v.ip || "",
        v.submittedAt || "",
      ]
        .map(val => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.concat(rows).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `visitors-export-${
      exportType === "today" ? "today" : exportDate
    }.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Registered Users
            </h1>
            <p className="text-gray-400 mt-2">Manage and view all visitors submissions</p>
          </div>
          <button
            onClick={() => setExportModal(true)}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <DownloadCloud size={20} />
            Export CSV
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={22} />
          <input
            type="text"
            placeholder="Search by name, email, mobile..."
            className="w-full pl-14 pr-6 py-4 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-400">No users found matching your search.</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800/40 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/80 backdrop-blur border-b border-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-gray-400">
                        S. No
                      </th>
                      <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-gray-400">
                        Name
                      </th>
                      <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-gray-400">
                        Email
                      </th>
                      <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-gray-400">
                        Phone
                      </th>
                      <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-gray-400 hidden md:table-cell">
                        Referral
                      </th>
                      <th className="px-6 py-5 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {paginated.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-800/60 transition-all duration-200 group"
                      >
                        <td className="px-6 py-5 text-xs font-mono text-blue-400">
                          {index+1}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 lg:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-300 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-500" />
                            <span className="truncate max-w-xs">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone size={14} className="text-gray-500" />
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden sm:table-cell">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            {user.referral}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-blue-500/25"
                          >
                            <Eye size={16} />
                            <span className="hidden sm:inline">View</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {paginated.length === 0 && !loading && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4 opacity-20">📋</div>
                  <p className="text-xl text-gray-500">No users found</p>
                  {search && <p className="text-sm text-gray-600 mt-2">Try adjusting your search query</p>}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 bg-gray-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                >
                  <ChevronLeft />
                </button>
                <span className="text-lg font-medium">
                  Page <span className="text-blue-400">{page}</span> of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 bg-gray-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-800 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedUser.name}</h2>
                  <p className="text-gray-400">User ID: {selectedUser.id}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex border-b border-gray-800">
                {[
                  { id: "info", label: "Personal Info", icon: User },
                  { id: "declaration", label: "Declaration", icon: FileCheck }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-8 py-4 font-medium transition ${
                      activeTab === tab.id
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-8">
                {activeTab === "info" && (
                  <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-5">
                      <h3 className="text-xl font-semibold text-blue-400">Basic Details</h3>
                      {[
                        ["Email", selectedUser.email, Mail] as const,
                        ["Phone", selectedUser.phone, Phone] as const,
                        ["City", selectedUser.city === "others" ? selectedUser.cityOther : selectedUser.city, MapPin] as const,
                        ["Pincode", selectedUser.pincode, MapPin] as const,
                      ].map(([label, value, Icon]) => {
                        const Component = Icon;
                        return (
                          <div key={label} className="flex items-center gap-4">
                            <Component size={20} className="text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">{label}</p>
                              <p className="font-medium text-gray-100">{value}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                    <div className="space-y-5">
                      <h3 className="text-xl font-semibold text-blue-400">Additional Info</h3>
                      {[
                        ["Project Configuration", selectedUser.projectConfig || "—"],
                        ["Booking Timeline", selectedUser.projectDuration || "—"],
                        ["Referral Type", selectedUser.referral],
                        ["Direct Source", selectedUser.directSource || "—"],
                        ["Source Details", selectedUser.directSourceOthers || "—"],
                        ["Broker Name", selectedUser.brokerName || "—"],
                        ["Broker Phone", selectedUser.brokerPhone || "—"],
                        ["Broker Company", selectedUser.brokerId || "—"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-sm text-gray-500">{label}</p>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === "declaration" && (
                  <div className="max-w-2xl mx-auto text-center py-10">
                    <div className={`text-6xl mb-6 ${selectedUser.otpVerified ? "text-green-500" : "text-red-500"}`}>
                      {selectedUser.otpVerified ? "✓" : "✗"}
                    </div>
                    <h3 className="text-2xl font-bold mb-6">
                      OTP {selectedUser.otpVerified ? "Verified" : "Not Verified"}
                    </h3>
                    <div className="space-y-4 bg-gray-800/50 rounded-2xl p-6">
                      <p><strong>Remarks:</strong> {selectedUser.notes || "—"}</p>
                      <p><strong>IP Address:</strong> {selectedUser.ip || "—"}</p>
                      <p><strong>Submitted At:</strong> {selectedUser.submittedAt || "—"}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {exportModal && (
          <motion.div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DownloadCloud /> Export Users
              </h3>
              <div className="space-y-5">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" checked={exportType === "today"} onChange={() => setExportType("today")} className="w-5 h-5 text-blue-500" />
                  <span className="text-lg">Today's Submissions Only</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" checked={exportType === "date"} onChange={() => setExportType("date")} className="w-5 h-5 text-blue-500" />
                  <span className="text-lg">Select Specific Date</span>
                </label>
                {exportType === "date" && (
                  <input
                    type="date"
                    value={exportDate}
                    onChange={(e) => setExportDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 outline-none"
                  />
                )}
              </div>
              <div className="flex gap-4 mt-8 justify-end">
                <button onClick={() => setExportModal(false)} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl">
                  Cancel
                </button>
                <button onClick={handleExport} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium">
                  Download CSV
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}