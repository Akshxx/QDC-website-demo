"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Admin } from "@/types/admin";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Type-safe access to user role
  const userRole = session?.user?.role as string | undefined;
  const isSuperAdmin = userRole === "superadmin";

  // Fetch admins list
  const fetchAdmins = async () => {
    if (status !== "authenticated") return;
    
    try {
      setLoading(true);
      const res = await fetch("/api/admin/list");
      
      if (!res.ok) {
        throw new Error("Failed to fetch admins");
      }
      
      const data = await res.json();
      setAdmins(data.admins);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin");
    }
    
    fetchAdmins();
  }, [status, router]);

  // Function to open the delete modal
  const handleDeleteClick = (admin: Admin) => {
    setAdminToDelete(admin);
    setDeleteModalOpen(true);
  };

  // Function to close the delete modal
  const handleCancelDelete = () => {
    setAdminToDelete(null);
    setDeleteModalOpen(false);
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    
    setDeletingInProgress(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ adminId: adminToDelete._id })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete admin");
      }
      
      // Remove admin from the list
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== adminToDelete._id));
      
      // Show success message
      setDeleteSuccess(`${adminToDelete.username} was successfully deleted.`);
      setTimeout(() => setDeleteSuccess(""), 3000);
      
      // Close the modal
      setDeleteModalOpen(false);
      setAdminToDelete(null);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setDeletingInProgress(false);
    }
  };

  // Loading state
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated and data is loaded
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto py-8">
          {/* Page header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Administrators</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                View and manage administrator accounts for your website
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/add-admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Add New Admin
              </Link>
              <Link
                href="/admin/home"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Admin role notice */}
          {!isSuperAdmin && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-md">
              <p className="text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                You have view-only access. Only super administrators can modify admin accounts.
              </p>
            </div>
          )}

          {/* Success message */}
          {deleteSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md"
            >
              <p className="text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {deleteSuccess}
              </p>
            </motion.div>
          )}

          {/* Admin list */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            {error ? (
              <div className="p-6 text-red-600 dark:text-red-400">
                <p>Error: {error}</p>
                <button 
                  onClick={() => {
                    setError("");
                    fetchAdmins();
                  }}
                  className="mt-2 text-blue-600 dark:text-blue-400 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <div className="col-span-3">Username</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {/* Table content */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {admins.map((admin) => (
                      <motion.div 
                        key={admin._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="col-span-3 font-medium text-gray-800 dark:text-gray-200">
                          {admin.username}
                        </div>
                        <div className="col-span-3 text-gray-600 dark:text-gray-300">
                          {admin.name || "-"}
                        </div>
                        <div className="col-span-3 text-gray-600 dark:text-gray-300">
                          {admin.email || "-"}
                        </div>
                        <div className="col-span-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            admin.role === "superadmin" 
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" 
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}>
                            {admin.role}
                          </span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end space-x-2">
                          {isSuperAdmin ? (
                            <button 
                              onClick={() => handleDeleteClick(admin)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Delete Admin"
                              disabled={session?.user?.username === admin.username}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-600 text-xs">
                              View only
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {admins.length === 0 && !loading && (
                    <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No administrators found
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && adminToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
            >
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-2xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Deletion</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Are you sure you want to delete the admin user <strong className="font-semibold">{adminToDelete.username}</strong>?
                    {adminToDelete.role === 'superadmin' && (
                      <span className="block mt-2 text-red-500 font-medium">
                        Warning: This is a Super Admin account!
                      </span>
                    )}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                    This action cannot be undone.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    disabled={deletingInProgress}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={deletingInProgress}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {deletingInProgress ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete Admin"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return null;
}
