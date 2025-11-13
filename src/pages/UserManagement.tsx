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
import ViewUserCredentials from "../components/ViewUserCredentials";

type TNewUserTypes = Omit<TUsers, "course" | "section" | "year">

export default function UserManagement() {
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

  const { data, isPending, isError } = useQuery(useAllUsersQuery());
  const { mutate } = useArchiveUserMutation();

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
    <div className="flex flex-col items-center py-10 px-2 w-full min-h-screen bg-linear-to-br animate-fadeIn from-[#eef2ff] via-[#e2e8f0] to-[#c7d2fe]">
      <div className="relative p-6 w-full rounded-3xl ring-1 shadow-xl md:p-10 max-w-[2000px] bg-white/80 backdrop-blur-md ring-black/5">
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl text-[#0f172a]">
              User Management
            </h1>
            <p className="text-sm md:text-base text-[#475569]">
              Manage staff, search users, and update statuses with ease.
            </p>
          </div>
          <div className="flex gap-2 items-center text-[#475569]">
            <span className="inline-flex gap-2 items-center py-1 px-3 text-sm font-medium rounded-full bg-[#eef2ff] text-[#3730a3]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
              {users.length} total users
            </span>
            <span className="hidden md:inline text-[#94a3b8]">|</span>
            <span className="hidden text-sm md:inline text-[#64748b]">
              {filteredUser.length} shown
            </span>
          </div>
        </div>
        <section className="flex flex-col gap-3 mb-6 md:flex-row md:gap-4 md:justify-between md:items-center">
          <div className="order-2 md:order-1">
            <Button onClick={() => setIsAddUserOpen(true)} name={"New User"} />
          </div>
          <div className="flex flex-col order-1 gap-2 w-full sm:flex-row sm:items-center md:order-2 md:w-auto">
            {/* Role Filter Buttons */}
            <div className="flex flex-row gap-2 -mt-5">
              <button
                onClick={() => setSelectedRole("all")}
                className={` px-6 py-3.5 max-sm:px-4 max-sm:py-3 rounded-md font-medium transition-all duration-200 ${selectedRole === "all"
                  ? " bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white shadow-md"
                  : "bg-white text-[#64748b] border border-[#e5e7eb] hover:bg-[#f8fafc] hover:border-[#d1d5db]"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRole("admin")}
                className={` px-6 py-3.5 max-sm:px-4 max-sm:py-3 rounded-md font-medium transition-all duration-200 ${selectedRole === "admin"
                  ? " bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white shadow-md"
                  : "bg-white text-[#64748b] border border-[#e5e7eb] hover:bg-[#f8fafc] hover:border-[#d1d5db]"
                  }`}
              >
                Admin
              </button>
              <button
                onClick={() => setSelectedRole("staff")}
                className={` px-6 py-3.5 max-sm:px-4 lg:-mr-12 max-sm:mr-10 max-sm:py-3 rounded-md font-medium transition-all duration-200 ${selectedRole === "staff"
                  ? " bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white shadow-md"
                  : "bg-white text-[#64748b] border border-[#e5e7eb] hover:bg-[#f8fafc] hover:border-[#d1d5db]"
                  }`}
              >
                Staff
              </button>
              {/* Select Component */}
              <div className="-mr-12 sm:min-w-[200px]">
                <SelectUserStatus onChangeStatus={setSelectedStatus} />
              </div>
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
        <div className="overflow-x-auto rounded-2xl border shadow-lg h-[60vh] bg-white/95 border-[#e5e7eb]">
          {isError ? (
            <ErrorTable />
          ) : filteredUser.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-8 w-full h-full text-center">
              <div className="inline-flex justify-center items-center mb-3 w-12 h-12 rounded-full bg-[#eef2ff] text-[#3730a3]">
                {/* magnifier icon substitute */}
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
                  <th className="sticky top-0 z-10 py-3 px-4 font-semibold tracking-wider text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                    Firstname
                  </th>
                  <th className="sticky top-0 z-10 py-3 px-4 font-semibold tracking-wider text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                    Lastname
                  </th>
                  <th className="sticky top-0 z-10 py-3 px-4 font-semibold tracking-wider text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                    Username
                  </th>
                  <th className="sticky top-0 z-10 py-3 px-4 font-semibold tracking-wider text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                    Email
                  </th>
                  <th className="sticky top-0 z-10 py-3 px-4 font-semibold tracking-wider text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                    Role
                  </th>
                  <th className="sticky top-0 z-10 py-3 px-4 font-semibold tracking-wider text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                    Status
                  </th>
                  <th className="sticky top-0 z-10 py-3 px-4 font-semibold tracking-wider text-left uppercase border-b md:py-4 md:px-6 bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUser
                  .filter((user) => user.userRole === "Admin" || user.userRole === "Staff")
                  .map((user) => (
                    <tr key={user.id}>
                      <UserTable
                        key={user.id}
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
                        onSetViewUserId={(userId) => setSelectedUserId(userId)}
                        onSetIsViewUserOpen={setIsViewCredentialsOpen}
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
      {isAddUserOpen && <AddUsers onClose={() => setIsAddUserOpen(false)} />}
      {
        isEditUserOpen && selectedUser && (
          <EditUser
            onClose={() => setIsEditUserOpen(false)}
            Id={selectedUserId}
            firstName={selectedUser.firstName}
            lastName={selectedUser.lastName}
            middleName={selectedUser.middleName}
            username={selectedUser.username}
            email={selectedUser.email}
            phoneNumber={selectedUser.phoneNumber}
            position={selectedUser.userRole}
          />
        )
      }
      {
        isArchiveModalOpen && (
          <PopUpModal
            title="Archive User"
            label="archive"
            noun="user"
            destination="archive"
            onHandleCancleAction={cancelArchiveUser}
            onHandleConfirmAction={confirmArchiveUser}
          />
        )
      }
      {selectedUser && isViewCredentialsOpen && (
        <ViewUserCredentials
          user={selectedUser}
          isOpen={isViewCredentialsOpen}
          onClose={() => setIsViewCredentialsOpen(false)}
        />
      )}
    </div >
  );
}
