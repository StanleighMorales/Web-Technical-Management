import { Activity, useCallback, useMemo, useState } from "react";
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


export default function UserManagement() {

  const { mutate } = useArchiveUser();
  const { users, isPending, isError } = useAllUsersManagement()
  const { filteredUser, setSearchUser, setSelectedStatus, selectedRole, setSelectedRole } = useFilteredUser()

  const [ShowSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [ShowErrorAlert, setErrorShowAlert] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<string>("");
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
  const [isViewCredentialsOpen, setIsViewCredentialsOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [archiveUserId, setArchiveUserId] = useState<string>("");

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId);
  }, [users, selectedUserId]);

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
        setErrorShowAlert(true);
        setArchiveUserId("");
        setShowSuccessAlert(false);
        setShowErrorMessage("You cannot delete the logged-in user!");
        setTimeout(() => {
          setErrorShowAlert(false);
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

  if (isPending) {
    return <UserSkeletonLoader />;
  }

  return (
    <div className="flex flex-col items-center py-8 px-4 w-full min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#eef2ff] animate-fadeIn">
      <Activity mode={ShowSuccessAlert ? "visible" : "hidden"}>
        <SuccessAlert message={showSuccessMessage} />
      </Activity>

      <Activity mode={ShowErrorAlert ? "visible" : "hidden"}>
        <ErrorAlert message={showErrorMessage} />
      </Activity>

      <div className="relative p-6 w-full max-w-[2000px] rounded-2xl md:rounded-3xl border border-[#e5e7eb]/80 shadow-[0_4px_24px_-4px_rgba(30,41,59,0.08),0_8px_48px_-8px_rgba(30,41,59,0.06)] bg-white/90 backdrop-blur-sm md:p-10 mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-[#e5e7eb]/60 md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1e293b] mb-1.5">
              Technical User Management
            </h1>
            <p className="text-sm sm:text-base text-[#475569]">
              Manage staff, search users, and update statuses with ease.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 items-center mt-4 md:mt-0">
            <span className="inline-flex gap-2 items-center py-2 px-4 text-sm font-medium rounded-full bg-[#eef2ff] text-[#3730a3] border border-[#c7d2fe]/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] ring-2 ring-[#22c55e]/30" />
              {
                users.filter((user) => user.status.toLowerCase() === "online")
                  .length
              }{" "}
              online
            </span>
            <span className="hidden md:inline w-px h-5 bg-[#e5e7eb]" />
            <span className="text-sm font-medium text-[#64748b]">
              {filteredUser.filter((a) => a.userRole ==="Admin" || a.userRole === "Staff").length} shown
            </span>
          </div>
        </div>

        {/* Actions & Filters */}
        <section className="flex flex-col gap-4 mb-6 lg:flex-row md:flex-row justify-between md:items-center">
          <div>
            <Button onClick={() => setIsAddUserOpen(true)} name={"New User"} />
          </div>

          <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center md:order-2 md:w-auto">
            <div className="flex flex-wrap gap-2 items-center">
              {["all", "admin", "staff"].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2.5 sm:px-5 sm:py-2 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3730a3]/40 focus-visible:ring-offset-2 ${
                    selectedRole === role
                      ? "bg-blue-500 text-white shadow-md shadow-[#3730a3]/25"
                      : "bg-white text-[#64748b] border border-[#e5e7eb] hover:border-[#3730a3]/40 hover:text-[#3730a3]"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
              <SelectUserStatus onChangeStatus={setSelectedStatus} />
              <div className="min-w-0 flex-1 sm:flex-initial">
                <SearchBar
                  onChangeValue={(value) => setSearchUser(value)}
                  name={"Search Users"}
                  placeholder={"Search by name, role, or status"}
                />
              </div>
            </div>
          </div>
        </section>

        {/* User Table */}
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_3px_0_rgba(30,41,59,0.06)] h-[50vh] sm:h-[60vh]">
          {isError ? (
            <ErrorTable />
          ) : filteredUser.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-12 w-full h-full text-center">
              <div className="inline-flex justify-center items-center mb-4 w-14 h-14 rounded-2xl bg-[#eef2ff] text-[#3730a3] border border-[#c7d2fe]/50">
                <span className="text-2xl" aria-hidden>🔎</span>
              </div>
              <p className="font-semibold text-[#0f172a] text-lg">No users found</p>
              <p className="max-w-sm mt-1 text-sm text-[#64748b]">
                Try adjusting your filters or search query, or add a new user.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto h-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    {[
                      "Firstname",
                      "Lastname",
                      "Username",
                      "Email",
                      "Role",
                      "Status",
                      "Action",
                    ].map((col, i) => (
                      <th
                        key={col}
                        className={`sticky top-0 z-10 py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-[#64748b] bg-[#f8fafc] border-b border-[#e5e7eb] md:py-4 md:px-5 first:pl-5 last:pr-5 ${
                          i === 0 ? "rounded-tl-xl" : ""
                        } ${i === 6 ? "rounded-tr-xl" : ""}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUser
                    .filter(
                      (user) =>
                        user.userRole === "Admin" || user.userRole === "Staff",
                    )
                    .map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => handleViewUserCredentials(user.id)}
                        className="transition-colors duration-150 odd:bg-white even:bg-[#f8fafc]/70 hover:bg-[#f1f5f9] cursor-pointer border-b border-[#e5e7eb]/50 last:border-b-0"
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
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tip */}
        <p className="mt-5 py-2.5 px-4 text-sm text-center text-[#64748b] rounded-lg bg-[#f8fafc]/80 border border-[#e5e7eb]/60 inline-block mx-auto">
          <span className="font-semibold text-[#475569]">Tip:</span> Use role and status filters plus search to find users quickly.
        </p>
      </div>

      <Activity mode={isAddUserOpen ? "visible" : "hidden"}>
        <AddUsers onClose={() => setIsAddUserOpen(false)} />
      </Activity>

      {isEditUserOpen && selectedUser && (
        <Activity mode="visible">
          <EditUser
            user={selectedUser}
            onClose={() => setIsEditUserOpen(false)}
          />
        </Activity>
      )}

      <Activity mode={isArchiveModalOpen ? "visible" : "hidden"}>
        <PopUpModal
          title="Archive User"
          label="archive"
          noun="user"
          destination="archive"
          onHandleCancelAction={cancelArchiveUser}
          onHandleConfirmAction={confirmArchiveUser}
        />
      </Activity>

      {selectedUser && isViewCredentialsOpen && (
        <Activity mode="visible">
          <ViewUserCredentials
            user={selectedUser}
            isOpen={isViewCredentialsOpen}
            onClose={() => setIsViewCredentialsOpen(false)}
          />
        </Activity>
      )}
    </div>
  );
}
