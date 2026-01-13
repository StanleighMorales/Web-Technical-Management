import { Activity, useCallback, useEffect, useMemo, useState } from "react";
import { AddUsers } from "../components/AddUser";
import Button from "../components/Button";
import EditUser from "../components/EditUser";
import SearchBar from "../components/SearchBar";
import type { TUsers } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { SelectUserStatus } from "../components/SelectUserStatus";
import { UserSkeletonLoader } from "../loader/UserSkeletonLoader";
import { useAllUsers } from "../hooks/userHooks";
import { useArchiveUser } from "../hooks/userHooks";
import UserTable from "../components/UserTable";
import ErrorTable from "../components/ErrorTables";
import PopUpModal from "../components/PopUpModal";
import ViewUserCredentials from "../components/ViewUserCredentials";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";

type TNewUserTypes = Omit<TUsers, "course" | "section" | "year">;

export default function UserManagement() {
  const [ShowSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [ShowErrorAlert, setErrorShowAlert] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<string>("");
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
  const [isViewCredentialsOpen, setIsViewCredentialsOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [archiveUserId, setArchiveUserId] = useState<string>("");
  const [users, setUsers] = useState<TNewUserTypes[]>([]);

  const { data, isPending, isError } = useQuery(useAllUsers());
  const { mutate } = useArchiveUser();

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId);
  }, [users, selectedUserId]);

  const filteredUser = useMemo(
    () =>
      users.filter((user) => {
        const userStatus = user.status.toLowerCase();
        const userRole = user.userRole.toLowerCase();
        const searchValue = searchUser.toLowerCase();
        const selectedStatusFilter = selectedStatus.toLowerCase();
        const selectedRoleFilter = selectedRole.toLowerCase();

        const matchesStatus =
          selectedStatusFilter === "all"
            ? true
            : userStatus === selectedStatusFilter;

        const matchesRole =
          selectedRoleFilter === "all" ? true : userRole === selectedRoleFilter;

        if (selectedStatusFilter !== "all" || selectedRoleFilter !== "all") {
          return (
            matchesStatus &&
            matchesRole &&
            (user.username.toLowerCase().includes(searchValue) ||
              user.userRole.toLowerCase().includes(searchValue) ||
              userStatus.includes(searchValue))
          );
        }

        return (
          user.username.toLowerCase().includes(searchValue) ||
          user.userRole.toLowerCase().includes(searchValue) ||
          userStatus.includes(searchValue)
        );
      }),
    [searchUser, selectedStatus, selectedRole, users],
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

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setUsers(data);
    }
  }, [data]);

  if (isPending) {
    return <UserSkeletonLoader />;
  }

  return (
    <div className="flex flex-col items-center py-6 px-2 w-full min-h-screen bg-linear-to-br animate-fadeIn ">
      <Activity mode={ShowSuccessAlert ? "visible" : "hidden"}>
        <SuccessAlert message={showSuccessMessage} />
      </Activity>

      <Activity mode={ShowErrorAlert ? "visible" : "hidden"}>
        <ErrorAlert message={showErrorMessage} />
      </Activity>

      <div className="relative p-6 w-full max-w-[2000px] rounded-3xl ring-1 shadow-xl bg-white/80 backdrop-blur-md ring-black/5 md:p-10 mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1e293b] drop-shadow-lg mb-2">
              Technical User Management
            </h1>
            <p className="text-sm sm:text-lg text-[#475569]">
              Manage staff, search users, and update statuses with ease.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 items-center text-[#475569] mt-4 md:mt-0">
            <span className="inline-flex gap-2 items-center py-1 px-3 text-sm font-medium rounded-full bg-[#eef2ff] text-[#3730a3]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
              {
                users.filter((user) => user.status.toLowerCase() === "online")
                  .length
              }{" "}
              total online
            </span>
            <span className="hidden md:inline text-[#94a3b8]">|</span>
            <span className="hidden md:inline text-sm text-[#64748b]">
              {filteredUser.length} shown
            </span>
          </div>
        </div>

        {/* Actions & Filters */}
        <section className="flex flex-col gap-4 mb-6 lg:flex-row md:flex-row justify-between  ">
          {/* Buttons */}
          <div>
            <Button onClick={() => setIsAddUserOpen(true)} name={"New User"} />
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center md:order-2 md:w-auto">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Role Buttons */}
              {["all", "admin", "staff"].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-3 sm:px-6 sm:py-2 rounded-md font-medium transition-all duration-200  ${selectedRole === role
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white text-[#64748b] border-2 border-[#e5e7eb] hover:border-[#2563eb] hover:text-[#2563eb]"
                    }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
              {/* Status Select */}
              <SelectUserStatus onChangeStatus={setSelectedStatus} />
              <div>
                {/* Search */}
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
        <div className="overflow-x-auto rounded-2xl border shadow-lg h-[50vh] sm:h-[60vh] bg-white/95 border-[#e5e7eb]">
          {isError ? (
            <ErrorTable />
          ) : filteredUser.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-8 w-full h-full text-center">
              <div className="inline-flex justify-center items-center mb-3 w-12 h-12 rounded-full bg-[#eef2ff] text-[#3730a3]">
                <span className="text-xl">🔎</span>
              </div>
              <p className="font-semibold text-[#0f172a]">No users found</p>
              <p className="max-w-md text-sm text-[#64748b]">
                Try adjusting your filters or search query. You can also add a
                new user.
              </p>
            </div>
          ) : (
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
                  ].map((col) => (
                    <th
                      key={col}
                      className="sticky top-0 z-10 py-3 px-4 font-semibold text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]"
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
                      className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9] cursor-pointer"
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
          )}
        </div>

        {/* Description */}
        <p className="mt-6 text-sm text-center text-[#64748b]">
          <span className="font-semibold">Tip:</span> Use role filters, status
          filters, and search to quickly locate users.
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
