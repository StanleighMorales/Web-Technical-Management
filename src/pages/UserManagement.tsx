import { useEffect, useMemo, useState } from "react";
import { AddUsers } from "../components/AddUser";
import Button from "../components/Button";
import EditUser from "../components/EditUser";
import SearchBar from "../components/SearchBar";
import type { TUsers } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { SelectUserStatus } from "../components/SelectUserStatus";
import { useAllUsersQuery } from "../query/get/useAllUsersQuery";
import { UserSkeletonLoader } from "../loader/UserSkeletonLoader";
import { useArchiveUserMutation } from "../query/delete/useArchiveUserMutation";
import UserTable from "../components/UserTable";
import ErrorTable from "../components/ErrorTables";
import PopUpModal from "../components/PopUpModal";

export default function UserManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [editUserId, setEditUserId] = useState<string>("");
  const [archiveUserId, setArchiveUserId] = useState<string>("");
  const [users, setUsers] = useState<TUsers[]>([]);

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === editUserId);
  }, [users, editUserId]);

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

  const { data, isPending, isError } = useQuery(useAllUsersQuery());
  const { mutate } = useArchiveUserMutation();

  const handleArchiveUser = (userId: string) => {
    setArchiveUserId(userId);
    setIsArchiveModalOpen(true);
  };

  const confirmArchiveUser = () => {
    mutate(archiveUserId);
    setIsArchiveModalOpen(false);
    setArchiveUserId("");
  };

  const cancelArchiveUser = () => {
    setIsArchiveModalOpen(false);
    setArchiveUserId("");
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
    <div className="animate-fadeIn min-h-screen w-full bg-gradient-to-br from-[#eef2ff] via-[#e2e8f0] to-[#c7d2fe] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-[2000px] bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-6 md:p-10 relative ring-1 ring-black/5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
              User Management
            </h1>
            <p className="text-sm md:text-base text-[#475569]">
              Manage staff, search users, and update statuses with ease.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#475569]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-sm font-medium text-[#3730a3]">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]"></span>
              {users.length} total users
            </span>
            <span className="hidden md:inline text-[#94a3b8]">|</span>
            <span className="hidden md:inline text-sm text-[#64748b]">
              {filteredUser.length} shown
            </span>
          </div>
        </div>
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-6">
          <div className="order-2 md:order-1">
            <Button onClick={() => setIsAddUserOpen(true)} name={"New User"} />
          </div>
          <div className="order-1 md:order-2 flex w-full md:w-auto flex-col sm:flex-row sm:items-center gap-2">
            {/* Role Filter Buttons */}
            <div className="-mt-5 flex flex-row gap-2">
              <button
                onClick={() => setSelectedRole("all")}
                className={` px-6 py-3.5 rounded-md font-medium transition-all duration-200 ${
                  selectedRole === "all"
                    ? " bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white shadow-md"
                    : "bg-white text-[#64748b] border border-[#e5e7eb] hover:bg-[#f8fafc] hover:border-[#d1d5db]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRole("admin")}
                className={` px-6 py-3.5 rounded-md font-medium transition-all duration-200 ${
                  selectedRole === "admin"
                    ? " bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white shadow-md"
                    : "bg-white text-[#64748b] border border-[#e5e7eb] hover:bg-[#f8fafc] hover:border-[#d1d5db]"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setSelectedRole("staff")}
                className={` px-6 py-3.5 rounded-md font-medium transition-all duration-200 ${
                  selectedRole === "staff"
                    ? " bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white shadow-md"
                    : "bg-white text-[#64748b] border border-[#e5e7eb] hover:bg-[#f8fafc] hover:border-[#d1d5db]"
                }`}
              >
                Staff
              </button>
            </div>
            {/* Select Component */}
            <div className="sm:min-w-[200px] -mr-12">
              <SelectUserStatus onChangeStatus={setSelectedStatus} />
            </div>
            {/* Search Bar Component */}
            <div className="flex-1">
              <SearchBar
                onChangeValue={(value) => setSearchUser(value)}
                name={"Search Users"}
                placeholder={"Search by name, role, or status"}
              />
            </div>
          </div>
        </section>

        {/* User Table / Empty State */}
        <div className="h-[60vh] overflow-x-auto rounded-2xl shadow-lg bg-white/95 border border-[#e5e7eb]">
          {isError ? (
            <ErrorTable />
          ) : filteredUser.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-8">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2ff] text-[#3730a3]">
                {/* magnifier icon substitute */}
                <span className="text-xl">🔎</span>
              </div>
              <p className="text-[#0f172a] font-semibold">No users found</p>
              <p className="text-[#64748b] text-sm max-w-md">
                Try adjusting your filters or search query. You can also add a
                new user.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    ID
                  </th>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Firstname
                  </th>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Lastname
                  </th>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Username
                  </th>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Email
                  </th>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Role
                  </th>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Status
                  </th>
                  <th className="bg-[#f8fafc]/90 backdrop-blur sticky top-0 z-10 font-semibold py-3 md:py-4 px-4 md:px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUser.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc]"
                  >
                    {/* User Table Component*/}
                    <UserTable
                      id={user.id}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      username={user.username}
                      email={user.email}
                      userRole={user.userRole}
                      status={user.status}
                      onSetEditUserId={() => setEditUserId(user.id)}
                      onSetIsEditUserOpen={() => setIsEditUserOpen(true)}
                      onMutate={() => handleArchiveUser(user.id)}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Description */}
        <p className="mt-6 text-[#64748b] text-sm text-center">
          <span className="font-semibold">Tip:</span> Use role filters, status
          filters, and search to quickly locate users.
        </p>
      </div>
      {isAddUserOpen && <AddUsers onClose={() => setIsAddUserOpen(false)} />}
      {isEditUserOpen && selectedUser && (
        <EditUser
          onClose={() => setIsEditUserOpen(false)}
          Id={editUserId}
          firstName={selectedUser.firstName}
          lastName={selectedUser.lastName}
          middleName={selectedUser.middleName}
          username={selectedUser.username}
          email={selectedUser.email}
          phoneNumber={selectedUser.phoneNumber}
          position={selectedUser.userRole}
        />
      )}
      {isArchiveModalOpen && (
        <PopUpModal
          title="Archive User"
          label="archive"
          noun="user"
          destination="archive"
          onHandleCancleAction={cancelArchiveUser}
          onHandleConfirmAction={confirmArchiveUser}
        />
      )}
    </div>
  );
}
