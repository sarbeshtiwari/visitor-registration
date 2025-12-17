import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Plus, X, Trash2, Shield, UserCheck, 
  Monitor, Users, Check, AlertCircle
} from "lucide-react";

interface Visitor {
  id: number;
  username: string;
  name: string;
  password: string;
  allowedScreens: string[];
  current_status: boolean;
}

const allScreens = [
  { name: "Users", icon: Users },
  { name: "Client Management", icon: UserCheck },
];

export default function SystemUsers() {
  const [users, setUsers] = useState<Visitor[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Visitor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    allowedScreens: [] as string[]
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://sar.ecis.in/api/suncity/auth/users");
      if (!res.ok) throw new Error("Failed to fetch users");

      const data: Visitor[] = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      alert("Error fetching users: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleSubmit = async () => {
    if (!formData.username || !formData.password || !formData.name) {
      alert("Name, username, and password are required!");
      return;
    }
    const res = await fetch("https://sar.ecis.in/api/suncity/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create user");

    closeModal();
    // Optionally refresh user list
    fetchUsers();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({ username: "", name: "", password: "", allowedScreens: [] });
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`https://sar.ecis.in/api/suncity/auth/users/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(users.filter(u => u.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleStatus = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    try {
      const res = await fetch(`https://sar.ecis.in/api/suncity/auth/users/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_status: !user.current_status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setUsers(users.map(u => u.id === id ? { ...u, current_status: !u.current_status } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              System Users
            </h1>
          </div>
          <p className="text-white/60 text-lg">Manage admin access and permissions</p>
        </motion.div>
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl hover:scale-105 transition-all shadow-xl font-medium text-lg"
          >
            <Plus className="w-6 h-6" />
            Add New User
          </button>
        </div>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-semibold">User</th>
                  <th className="px-8 py-6 text-left text-sm font-semibold">Name</th>
                  <th className="px-8 py-6 text-left text-sm font-semibold">Permissions</th>
                  <th className="px-8 py-6 text-left text-sm font-semibold">Status</th>
                  <th className="px-8 py-6 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    <td className="px-8 py-6">{user.username}</td>
                    <td className="px-8 py-6">{user.name}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {user.allowedScreens.map(screen => {
                          const Icon = allScreens.find(s => s.name === screen)?.icon || Monitor;
                          return (
                            <span key={screen} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-medium">
                              <Icon className="w-4 h-4" />
                              {screen}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${user.current_status ? "bg-cyan-500" : "bg-red-500/50"}`}
                      >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all ${user.current_status ? "translate-x-7" : "translate-x-1"}`} />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {user.current_status ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </span>
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-all hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={e => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl max-w-2xl w-full p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">{editingUser ? "Edit User" : "Create New User"}</h2>
                  <button onClick={closeModal} className="p-3 hover:bg-white/10 rounded-xl">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-cyan-400 transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-cyan-400 transition-all"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-cyan-400 transition-all"
                      placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4">Access Permissions</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {allScreens.map(({ name, icon: Icon }) => (
                        <label
                          key={name}
                          className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-white/10"
                        >
                          <input
                            type="checkbox"
                            checked={formData.allowedScreens.includes(name)}
                            onChange={e => {
                              if (e.target.checked) {
                                setFormData({ ...formData, allowedScreens: [...formData.allowedScreens, name] });
                              } else {
                                setFormData({ ...formData, allowedScreens: formData.allowedScreens.filter(s => s !== name) });
                              }
                            }}
                            className="w-5 h-5 rounded border-white/30"
                          />
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-6">
                    <button onClick={closeModal} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl hover:scale-105 transition-all font-medium shadow-lg"
                    >
                      {editingUser ? "Update User" : "Create User"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900 to-red-900/50 backdrop-blur-2xl border border-red-500/50 rounded-3xl p-8 max-w-md w-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                  <h3 className="text-2xl font-bold">Delete User?</h3>
                </div>
                <p className="text-white/80 mb-8">
                  This action cannot be undone. This will permanently delete the user account.
                </p>
                <div className="flex gap-4 justify-end">
                  <button onClick={() => setDeleteConfirm(null)} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl">
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(deleteConfirm)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium"
                  >
                    Delete Permanently
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
