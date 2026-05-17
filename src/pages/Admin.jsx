import React, { useCallback, useEffect, useMemo, useState } from "react";
import { deleteUser, fetchUsers } from "../services/api";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const adminCount = useMemo(() => users.filter((u) => u.is_admin).length, [users]);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (u) => {
    if (deletingId) return;
    setUserToDelete(u);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete || deletingId) return;
    setDeletingId(userToDelete.id);
    setError("");
    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((x) => x.id !== userToDelete.id));
    } catch (e) {
      setError(e?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "#070d1a" }}>
      <Navbar />
      <main className="max-w-[1600px] mx-auto px-8 md:px-16 py-8 min-h-[calc(100vh-80px)] flex flex-col">
        <div
          className="rounded-xl p-6 border mb-6"
          style={{ background: "#0d1225", borderColor: "#1e2d4a" }}
        >
          <h1 className="font-sans text-2xl font-bold text-slate-100 tracking-tight">Admin</h1>
          <p className="text-sm font-mono mt-2" style={{ color: "#4b5563" }}>
            Manage users · {users.length} total · {adminCount} admins
          </p>
        </div>

        {error ? (
          <div className="rounded-lg p-4 mb-6 text-sm font-sans border bg-red-500/10 text-red-300 border-red-500/30">
            {error}
          </div>
        ) : null}

        <div className="rounded-xl border overflow-hidden" style={{ background: "#0d1225", borderColor: "#1e2d4a" }}>
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "#1e2d4a" }}>
            <div className="text-slate-200 font-sans text-base font-semibold">Users</div>
            <button
              onClick={load}
              disabled={loading}
              className="rounded-lg px-4 py-2.5 text-sm font-sans border border-navy-500
                text-slate-500 hover:text-slate-300 disabled:opacity-40 transition-all"
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="h-12 rounded-lg animate-pulse" style={{ background: "#111827" }} />
              <div className="h-12 rounded-lg animate-pulse mt-3" style={{ background: "#111827" }} />
              <div className="h-12 rounded-lg animate-pulse mt-3" style={{ background: "#111827" }} />
            </div>
          ) : users.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-700">
              <div className="text-center py-36">
                <div className="text-5xl mb-4 opacity-40">◎</div>
                <p className="font-sans text-base text-slate-600">No users found</p>
                <p className="text-sm font-mono mt-2 text-slate-700">Check your backend admin endpoints.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs font-mono text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-medium">Email</th>
                    <th className="px-5 py-4 font-medium">Role</th>
                    <th className="px-5 py-4 font-medium">User ID</th>
                    <th className="px-5 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="border-t" style={{ borderColor: "#1e2d4a" }}>
                      <td className="px-5 py-4 font-mono text-slate-200">{u.email}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold font-sans
                            ${u.is_admin ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-navy-900 border-navy-500 text-slate-500"}`}
                        >
                          {u.is_admin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-600">{u.id}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => onDelete(u)}
                          disabled={deletingId === u.id}
                          className="bg-red-900/40 hover:bg-red-900/70 border border-red-700 rounded-lg
                            px-4 py-2 text-red-300 text-xs font-sans transition-colors disabled:opacity-50"
                        >
                          {deletingId === u.id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Delete user ${userToDelete?.email}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}

