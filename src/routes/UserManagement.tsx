import { useCallback, useMemo } from "react";
import { AddUsers } from "../components/AddUser";
import Button from "../components/Button";
import EditUser from "../components/EditUser";
import SearchBar from "../components/SearchBar";
import { SelectUserStatus } from "../components/SelectUserStatus";
import { UserSkeletonLoader } from "../loader/UserSkeletonLoader";
import { useArchiveUser } from "../hooks/userHooks";
import UserTable from "../components/UserTable";
import ErrorTable from "../components/ErrorTables";
import PopUpModal from "../components/PopUpModal";
import ViewUserCredentials from "../components/ViewUserCredentials";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import { useAllUsersManagement, useFilteredUser } from "../data/user-management-data";
import { useCommonState } from "../states/index-state";
import { useAllUsersManagementState } from "../states/user-management-state";
import {
  Users,
  Sparkles,
  ChevronRight,
  Search,
} from "lucide-react";

export default function UserManagement() {
  const { mutate } = useArchiveUser();
  const { users, isPending, isError } = useAllUsersManagement();
  const { filteredUser, setSearchUser, setSelectedStatus, selectedRole, setSelectedRole } = useFilteredUser();

  const {
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
    showSuccessMessage,
    setShowSuccessMessage,
    showErrorMessage,
    setShowErrorMessage,
  } = useCommonState();

  const {
    isAddUserOpen,
    setIsAddUserOpen,
    isEditUserOpen,
    setIsEditUserOpen,
    isViewCredentialsOpen,
    setIsViewCredentialsOpen,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    selectedUserId,
    setSelectedUserId,
    archiveUserId,
    setArchiveUserId,
  } = useAllUsersManagementState();

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId],
  );

  const confirmArchiveUser = useCallback(() => {
    mutate(archiveUserId, {
      onSuccess: (d) => {
        setIsArchiveModalOpen(false);
        setShowSuccessAlert(true);
        setArchiveUserId("");
        setShowSuccessMessage(d.message);
        setTimeout(() => {
          setShowSuccessAlert(false);
          setShowSuccessMessage("");
        }, 3500);
      },
      onError: () => {
        setIsArchiveModalOpen(false);
        setShowErrorAlert(true);
        setArchiveUserId("");
        setShowSuccessAlert(false);
        setShowErrorMessage("You cannot delete the logged-in user!");
        setTimeout(() => {
          setShowErrorAlert(false);
          setShowErrorMessage("");
        }, 3500);
      },
    });
  }, [archiveUserId, mutate]);

  const cancelArchiveUser = () => {
    setIsArchiveModalOpen(false);
    setArchiveUserId("");
  };

  const handleViewUserCredentials = (id: string) => {
    setSelectedUserId(id);
    setIsViewCredentialsOpen(true);
  };

  const tableUsers = filteredUser.filter(
    (user) => user.userRole === "Admin" || user.userRole === "Staff",
  );

  const onlineCount = users.filter(
    (u) => u.status.toLowerCase() === "online",
  ).length;

  if (isPending) return <UserSkeletonLoader />;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* Alerts */}
      {showSuccessAlert && <SuccessAlert message={showSuccessMessage} />}
      {showErrorAlert && <ErrorAlert message={showErrorMessage} />}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex mt-12 md:mt-0 items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Staff directory</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            User Management
          </h1>
          <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
            Manage staff accounts, update roles, and monitor online status across your team.
          </p>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
            <span>{onlineCount} online</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <Users className="h-4 w-4 text-slate-400" />
            <span>{tableUsers.length} shown</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Toolbar */}
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Button onClick={() => setIsAddUserOpen(true)} name="New User" />

          <div className="flex flex-wrap lg:justify-end items-center gap-2">
            {/* Role filter pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
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

            <SelectUserStatus onChangeStatus={setSelectedStatus} />

            <SearchBar
              onChangeValue={(value) => setSearchUser(value)}
              name="Search Users"
              placeholder="Search by name, role, or status"
            />
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
                    {["First Name", "Last Name", "Username", "Email", "Role", "Status", "Action"].map(
                      (col) => (
                        <th
                          key={col}
                          className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400"
                        >
                          {col}
                        </th>
                      ),
                    )}
                    <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4" />
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
                        onSetEditUserId={(userId) => {
                          setSelectedUserId(userId);
                          setIsEditUserOpen(true);
                        }}
                        onSetIsEditUserOpen={setIsEditUserOpen}
                        onMutate={(userId) => {
                          setArchiveUserId(userId);
                          setIsArchiveModalOpen(true);
                        }}
                      />
                      <td className="px-6 py-4">
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </td>
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
