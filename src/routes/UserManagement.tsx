import { useCallback, useMemo } from "react";
import { AddUsers } from "../components/AddUser";
import Button from "../components/Button";
import EditUser from "../components/EditUser";
import SearchBar from "../components/SearchBar";
import { SelectUserStatus } from "../components/SelectUserStatus";
import { UserSkeletonLoader } from "../loader/UserSkeletonLoader";
import { useArchiveUser, useBlockUser, useUnblockUser } from "../hooks/userHooks";
import UserTable from "../components/UserTable";
import ErrorTable from "../components/ErrorTables";
import PopUpModal from "../components/PopUpModal";
import BlockUserModal from "../components/BlockUserModal";
import ViewUserCredentials from "../components/ViewUserCredentials";
import { showToast } from "../components/AppToast";
import { useAllUsersManagement, useFilteredUser } from "../data/user-management-data";
import { useAllUsersManagementState } from "../states/user-management-state";
import RegistrationModule from "../components/RegistrationModule";
import {
  Users,
  Sparkles,
  Search,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

export default function UserManagement() {
  const {
    activeTab,
    setActiveTab,
    isAddUserOpen,
    setIsAddUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    isViewCredentialsOpen,
    setIsViewCredentialsOpen,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    isBlockModalOpen,
    setIsBlockModalOpen,
    selectedUserId,
    setSelectedUserId,
    archiveUserId,
    setArchiveUserId,
    blockUserId,
    setBlockUserId,
  } = useAllUsersManagementState();

  const { mutate, isPending: isArchiving } = useArchiveUser();
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutate: unblockUser } = useUnblockUser();
  const { users, isPending, isError } = useAllUsersManagement();
  const { filteredUser, setSearchUser, setSelectedStatus, selectedRole, setSelectedRole } = useFilteredUser();

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId],
  );

  const blockUserData = useMemo(
    () => users.find((u) => u.id === blockUserId),
    [users, blockUserId],
  );

  const confirmArchiveUser = useCallback(() => {
    mutate(archiveUserId, {
      onSuccess: (d) => {
        setIsArchiveModalOpen(false);
        setArchiveUserId("");
        showToast.success("User Archived", d.message);
      },
      onError: () => {
        setIsArchiveModalOpen(false);
        setArchiveUserId("");
        showToast.error("Action Failed", "You cannot archive the logged-in user!");
      },
    });
  }, [archiveUserId, mutate, setIsArchiveModalOpen, setArchiveUserId]);

  const cancelArchiveUser = () => {
    setIsArchiveModalOpen(false);
    setArchiveUserId("");
  };

  const handleViewUserCredentials = (id: string) => {
    setSelectedUserId(id);
    setIsViewCredentialsOpen(true);
  };

  const handleBlockUser = (id: string) => {
    setBlockUserId(id);
    setIsBlockModalOpen(true);
  };

  const handleUnblockUser = (id: string) => {
    unblockUser(id, {
      onSuccess: () => {
        showToast.success("User Unblocked", "User has been unblocked successfully.");
      },
      onError: (error: any) => {
        showToast.error("Action Failed", error?.response?.data?.message || "Failed to unblock user.");
      },
    });
  };

  const confirmBlockUser = (data: { reason: string; isPermanent: boolean; blockedUntil?: string }) => {
    blockUser(
      { id: blockUserId, data },
      {
        onSuccess: () => {
          setIsBlockModalOpen(false);
          setBlockUserId("");
          showToast.success("User Blocked", "User has been blocked successfully.");
        },
        onError: (error: any) => {
          setIsBlockModalOpen(false);
          setBlockUserId("");
          showToast.error("Action Failed", error?.response?.data?.message || "Failed to block user.");
        },
      },
    );
  };

  const cancelBlockUser = () => {
    setIsBlockModalOpen(false);
    setBlockUserId("");
  };

  const tableUsers = filteredUser.filter(
    (user) => (user.userRole === "Admin" || user.userRole === "Staff") && user.status?.toLowerCase() !== "archived",
  );

  const staffUsers = users.filter((u) => u.userRole === "Staff" && u.status?.toLowerCase() !== "archived");
  const adminUsers = users.filter((u) => u.userRole === "Admin" && u.status?.toLowerCase() !== "archived");
  const staffOnlineCount = staffUsers.filter((u) => u.status.toLowerCase() === "online").length;
  const adminOnlineCount = adminUsers.filter((u) => u.status.toLowerCase() === "online").length;

  if (isPending) return <UserSkeletonLoader />;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex mt-12 md:mt-0 items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>User directory</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            User Management
          </h1>
          <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
            Manage all system users — staff accounts, teachers, and students — from one place.
          </p>
        </div>
      </div>

      {/* Top-level tab switcher with stats and New User button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("staff")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "staff"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Staff & Admins
          </button>
          <button
            onClick={() => setActiveTab("registered")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "registered"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Teachers & Students
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setIsAddUserOpen(true)} name="New User" />
        </div>
      </div>

      {/* ── Staff & Admins tab ── */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-4xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

          {/* Toolbar */}
          <div className="px-6 md:px-8 py-4 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left side - Minimal Stats */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700">{tableUsers.length}</span>
                  <span className="text-xs text-slate-500">total</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                  <span className="text-sm font-semibold text-violet-700">{staffUsers.length}</span>
                  <span className="text-xs text-violet-600">staff</span>
                  <span className="text-xs text-violet-500">({staffOnlineCount} online)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">{adminUsers.length}</span>
                  <span className="text-xs text-amber-600">admins</span>
                  <span className="text-xs text-amber-500">({adminOnlineCount} online)</span>
                </div>
              </div>

              {/* Right side - Filters and Search */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 lg:justify-end">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
                  {["all", "admin", "staff"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        selectedRole === role
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="shrink-0">
                  <SelectUserStatus onChangeStatus={setSelectedStatus} />
                </div>
                <div className="grow sm:grow-0 sm:w-auto">
                  <SearchBar
                    onChangeValue={(value) => setSearchUser(value)}
                    name="Search Users"
                    placeholder="Search by name, role, or status"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="min-h-[55vh] max-h-[55vh] overflow-y-auto">
              {isError ? (
                <ErrorTable />
              ) : tableUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                  <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No users found</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    Try adjusting your filters or search query, or add a new user.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["First Name", "Last Name", "Username", "Email", "Role", "Status"].map((col) => (
                        <th
                          key={col}
                          className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400"
                        >
                          {col}
                        </th>
                      ))}
                      <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableUsers.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => handleViewUserCredentials(user.id)}
                        className="group transition-all duration-200 hover:bg-indigo-50/30 cursor-pointer"
                      >
                        <UserTable
                          id={user.id}
                          firstName={user.firstName}
                          lastName={user.lastName}
                          username={user.username}
                          email={user.email}
                          userRole={user.userRole}
                          status={user.status}
                          isBlocked={user.isBlocked}
                          onSetEditUserId={(userId) => {
                            setSelectedUserId(userId);
                            setIsEditUserOpen(true);
                          }}
                          onSetIsEditUserOpen={setIsEditUserOpen}
                          onMutate={(userId) => {
                            setArchiveUserId(userId);
                            setIsArchiveModalOpen(true);
                          }}
                          onBlockUser={handleBlockUser}
                          onUnblockUser={handleUnblockUser}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Footer hint */}
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400 font-medium">
              <span className="font-semibold text-slate-500">Tip:</span> Click any row to view user credentials. Use role and status filters to narrow results.
            </p>
          </div>
        </div>
      )}

      {/* ── Registered Users tab ── */}
      {activeTab === "registered" && (
        <RegistrationModule embedded />
      )}

      {/* Modals */}
      {isAddUserOpen && (
        <AddUsers onClose={() => setIsAddUserOpen(false)} />
      )}

      {isEditUserOpen && selectedUser && (
        <EditUser
          user={selectedUser}
          onClose={() => setIsEditUserOpen(false)}
        />
      )}

      {isArchiveModalOpen && (
        <PopUpModal
          title="Archive User"
          label="archive"
          noun="user"
          destination="archive"
          onHandleCancelAction={cancelArchiveUser}
          onHandleConfirmAction={confirmArchiveUser}
          isLoading={isArchiving}
        />
      )}

      {blockUserData && (
        <BlockUserModal
          isOpen={isBlockModalOpen}
          onClose={cancelBlockUser}
          onConfirm={confirmBlockUser}
          userName={`${blockUserData.firstName} ${blockUserData.lastName}`}
          isLoading={isBlocking}
        />
      )}

      {selectedUser && isViewCredentialsOpen && (
        <ViewUserCredentials
          user={selectedUser}
          isOpen={isViewCredentialsOpen}
          onClose={() => setIsViewCredentialsOpen(false)}
        />
      )}
    </div>
  );
}
