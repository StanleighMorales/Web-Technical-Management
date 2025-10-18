import { useArchivesItemsQuery } from "../query/get/useArchivesItemsQuery.ts";
import { useArchivesUsersQuery } from "../query/get/useArchiveUsersQuery.ts";
import { FaTrash, FaUser } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import ArchiveSkeletonLoader from "../loader/ArchiveSkeletonLoader.tsx";
import type { TArchiveItem, TUsers } from "../types/types.ts";
import { useRestoreItemMutation } from "../query/delete/useRestoreItemMutation.ts";
import { useRestoreUserMutation } from "../query/delete/useRestoreUserMutation.ts";
import ErrorTable from "../components/ErrorTables.tsx";
import SearchBar from "../components/SearchBar.tsx";
import Pagination from "../components/Pagination.tsx";
import ArchiveItemTable from "../components/ArchiveItemTable.tsx";
import { useDeleteItemMutation } from "../query/delete/useDeleteItemMutation.ts";
import PopUpModal from "../components/PopUpModal.tsx";
import PopUpModalDelete from "../components/PopUpModalDelete.tsx";
import { UserData } from "../utils/usersData/userData.ts";
import { FaTrashRestore } from "react-icons/fa";
import { type FC } from "react";
import ArchiveTeacherTable from "../components/ArchiveTeacherTable.tsx";
import ArchiveStudentTable from "../components/ArchiveStudentTable.tsx";

export default function Archive() {
  const [archiveItems, setArchiveItems] = useState<TArchiveItem[]>([]);
  const [archiveUsers, setArchiveUsers] = useState<TUsers[]>([]);
  const [searchItem, setSearchItem] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<"items" | "users" | "teachers" | "students">("items");
  const itemsPerPage = 5;
  const userData = UserData();

  const { data, isPending, isError } = useQuery(useArchivesItemsQuery());
  const { data: usersData, isPending: isUsersPending, isError: isUsersError } = useQuery(useArchivesUsersQuery());
  const restoreMutation = useRestoreItemMutation();
  const restoreUserMutation = useRestoreUserMutation();
  const deleteMutation = useDeleteItemMutation()
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [restoreSelectedId, setRestoreSelectedId] = useState<string | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteSelectedId, setDeleteSelectedId] = useState<string | null>(null)
  const [isUserRestoreConfirmOpen, setIsUserRestoreConfirmOpen] = useState(false)
  const [userRestoreSelectedId, setUserRestoreSelectedId] = useState<string | null>(null)
  const [isUserDeleteConfirmOpen, setIsUserDeleteConfirmOpen] = useState(false)
  const [userDeleteSelectedId, setUserDeleteSelectedId] = useState<string | null>(null)


  // Filter items based on search term and category
  const filteredItems = useMemo(
    () =>
      (archiveItems || []).filter((item) => {
        const searchTerm = searchItem?.toLowerCase() || '';
        const matchesSearch =
          (item.itemName?.toLowerCase() || '').includes(searchTerm) ||
          (item.category?.toLowerCase() || '').includes(searchTerm) ||
          (item.serialNumber?.toLowerCase() || '').includes(searchTerm) ||
          (item.itemType?.toLowerCase() || '').includes(searchTerm) ||
          (item.itemModel?.toLowerCase() || '').includes(searchTerm) ||
          (item.itemMake?.toLowerCase() || '').includes(searchTerm);

        const matchesCategory =
          selectedCategory === "" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      }),
    [archiveItems, searchItem, selectedCategory],
  );

  // Filter users based on search term, userRole, and active filter
  const filteredUsers = useMemo(
    () =>
      (archiveUsers || []).filter((user) => {
        // Filter by active filter (users, teachers, students)
        let roleMatches = false;
        if (activeFilter === "users") {
          // Show Admin and Staff users
          roleMatches = user.userRole?.toLowerCase() === 'admin' || user.userRole?.toLowerCase() === 'staff';
        } else if (activeFilter === "teachers") {
          // Show only Teachers
          roleMatches = user.userRole?.toLowerCase() === 'teacher';
        } else if (activeFilter === "students") {
          // Show only Students
          roleMatches = user.userRole?.toLowerCase() === 'student';
        }

        if (!roleMatches) return false;

        const searchTerm = searchItem?.toLowerCase() || '';
        const matchesSearch =
          (user.firstName?.toLowerCase() || '').includes(searchTerm) ||
          (user.lastName?.toLowerCase() || '').includes(searchTerm) ||
          (user.middleName?.toLowerCase() || '').includes(searchTerm) ||
          (user.username?.toLowerCase() || '').includes(searchTerm) ||
          (user.email?.toLowerCase() || '').includes(searchTerm) ||
          (user.phoneNumber?.toLowerCase() || '').includes(searchTerm) ||
          (user.userRole?.toLowerCase() || '').includes(searchTerm);

        const matchesRole =
          selectedCategory === "" || user.userRole === selectedCategory;

        return matchesSearch && matchesRole;
      }),
    [archiveUsers, searchItem, selectedCategory, activeFilter],
  );

  const totalPages = Math.ceil(
    activeFilter === "items" ? filteredItems.length / itemsPerPage : filteredUsers.length / itemsPerPage
  );

  // Ensure current page is valid
  const validCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedItems = useMemo(
    () =>
      filteredItems.slice(
        (validCurrentPage - 1) * itemsPerPage,
        validCurrentPage * itemsPerPage,
      ),
    [filteredItems, itemsPerPage, validCurrentPage],
  );

  const paginatedUsers = useMemo(
    () =>
      filteredUsers.slice(
        (validCurrentPage - 1) * itemsPerPage,
        validCurrentPage * itemsPerPage,
      ),
    [filteredUsers, itemsPerPage, validCurrentPage],
  );

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);


  // Handle showing all items
  const handleShowAll = useCallback(() => {
    setSelectedCategory("");
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (data) setArchiveItems(data);
  }, [data]);

  useEffect(() => {
    if (usersData) setArchiveUsers(usersData);
  }, [usersData]);

  if (isPending || isUsersPending) {
    return <ArchiveSkeletonLoader />;
  }

  const handleRestoreItem = (id: string) => {
    setRestoreSelectedId(id)
    setIsRestoreConfirmOpen(true)
  }

  const handleCancelRestore = () => {
    setIsRestoreConfirmOpen(false)
    setRestoreSelectedId(null)
  }

  const handleConfirmRestoreItem = () => {
    if (!restoreSelectedId) return
    restoreMutation.mutate(restoreSelectedId, {
      onSuccess: () => {
        setIsRestoreConfirmOpen(false)
        setRestoreSelectedId(null)
        window.location.reload();
      }
    });
  }

  const handleDelete = (id: string) => {
    setDeleteSelectedId(id)
    setIsDeleteConfirmOpen(true)
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false)
    setDeleteSelectedId(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteSelectedId) return
    deleteMutation.mutate(deleteSelectedId, {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false)
        setDeleteSelectedId(null)
        window.location.reload();
      }
    });
  }

  const handleRestoreUser = (id: string) => {
    setUserRestoreSelectedId(id)
    setIsUserRestoreConfirmOpen(true)
  }

  const handleCancelUserRestore = () => {
    setIsUserRestoreConfirmOpen(false)
    setUserRestoreSelectedId(null)
  }

  const handleConfirmRestoreUser = () => {
    if (!userRestoreSelectedId) return
    restoreUserMutation.mutate(userRestoreSelectedId, {
      onSuccess: () => {
        setIsUserRestoreConfirmOpen(false)
        setUserRestoreSelectedId(null)
        window.location.reload();
      }
    });
  }

  const handleDeleteUser = (id: string) => {
    setUserDeleteSelectedId(id)
    setIsUserDeleteConfirmOpen(true)
  };

  const handleCancelUserDelete = () => {
    setIsUserDeleteConfirmOpen(false)
    setUserDeleteSelectedId(null)
  }

  const handleConfirmDeleteUser = () => {
    if (!userDeleteSelectedId) return
    deleteMutation.mutate(userDeleteSelectedId, {
      onSuccess: () => {
        setIsUserDeleteConfirmOpen(false)
        setUserDeleteSelectedId(null)
        window.location.reload();
      }
    });
  }

  type checkIfUserAdminProps = {
    onHandleRestoreUser: () => void,
    onHandleDeleteUser: () => void
  }


  const ShowButtonIfUserAdmin: FC<checkIfUserAdminProps> = ({ onHandleRestoreUser, onHandleDeleteUser }) => {
    if (userData.userRole?.toLowerCase() !== "admin" && userData.userRole?.toLowerCase() !== "super admin") return null;
    return (
      <>
        <button
          onClick={onHandleDeleteUser}
          // disabled={isDeleting}
          title="Delete user"
          className="text-red-600 text-2xl cursor-pointer mr-2"
        >
          <FaTrash />
        </button>

        <button
          onClick={onHandleRestoreUser}
          // disabled={isRestoring}
          title="Restore user"
          className="text-orange-300 text-2xl cursor-pointer"
        >
          <FaTrashRestore />
        </button>
      </>
    )
  }


  return (
    <div className="animate-fadeIn archive-list-container min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe] flex flex-col">
      <header className="archive-header pt-8 px-8 pb-8 bg-white/80 shadow-md flex flex-col items-center z-50">
        <h1 className="text-[#1e293b] text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
          Archived {activeFilter === "items" ? "Items" : activeFilter === "users" ? "Users" : activeFilter === "teachers" ? "Teachers" : "Students"}
        </h1>
        <p className="text-[#64748b] text-lg font-medium max-w-2xl text-center mb-6">
          Manage archived {activeFilter === "items" ? "items" : activeFilter === "users" ? "users" : activeFilter === "teachers" ? "teachers" : "students"} and restore them if needed. View all previously archived {activeFilter === "items" ? "assets" : activeFilter === "users" ? "accounts" : activeFilter === "teachers" ? "teacher accounts" : "student accounts"}.
        </p>
      </header>

      {/* Filter Buttons */}
      {isError || isUsersError ? "" : (
        <div className="flex gap-4 mt-8 ml-10">
          <button
            onClick={() => {
              setActiveFilter("items");
              setCurrentPage(1);
              setSearchItem("");
              setSelectedCategory("");
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeFilter === "items"
              ? "bg-gradient-to-r from-[#4f88f9] to-[#38bdf8] text-white shadow-lg scale-105"
              : "bg-white text-[#64748b] border-2 border-[#e0e7ef] hover:border-[#2563eb] hover:text-[#2563eb]"
              }`}
          >
            Items
          </button>
          <button
            onClick={() => {
              setActiveFilter("users");
              setCurrentPage(1);
              setSearchItem("");
              setSelectedCategory("");
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeFilter === "users"
              ? "bg-gradient-to-r from-[#4f88f9] to-[#38bdf8] text-white shadow-lg scale-105"
              : "bg-white text-[#64748b] border-2 border-[#e0e7ef] hover:border-[#2563eb] hover:text-[#2563eb]"
              }`}
          >
            Users
          </button>
          <button
            onClick={() => {
              setActiveFilter("teachers");
              setCurrentPage(1);
              setSearchItem("");
              setSelectedCategory("");
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeFilter === "teachers"
              ? "bg-gradient-to-r from-[#4f88f9] to-[#38bdf8] text-white shadow-lg scale-105"
              : "bg-white text-[#64748b] border-2 border-[#e0e7ef] hover:border-[#2563eb] hover:text-[#2563eb]"
              }`}
          >
            Teachers
          </button>
          <button
            onClick={() => {
              setActiveFilter("students");
              setCurrentPage(1);
              setSearchItem("");
              setSelectedCategory("");
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeFilter === "students"
              ? "bg-gradient-to-r from-[#4f88f9] to-[#38bdf8] text-white shadow-lg scale-105"
              : "bg-white text-[#64748b] border-2 border-[#e0e7ef] hover:border-[#2563eb] hover:text-[#2563eb]"
              }`}
          >
            Students
          </button>
        </div>
      )}

      <div className="h-full overflow-auto mt-8">
        {/* Archived Items/Users Table */}
        <section className="px-8">
          <div className="bg-white/90 h-[55vh] py-4 px-4 rounded-3xl shadow-md border border-[#e0e7ef] overflow-x-auto">
            <section className="mb-4 flex justify-between">
              <div className=""></div>
              <div className="flex flex-row gap-2">
                {/* Pagination Component */}
                {((activeFilter === "items" && filteredItems.length > 0) || (activeFilter === "users" && filteredUsers.length > 0)) && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    selectedCategory={selectedCategory}
                    handleShowAll={handleShowAll}
                  />
                )}
                {/* Search Bar Component */}
                <SearchBar
                  onChangeValue={(value) => setSearchItem(value)}
                  name="search"
                  placeholder={`Search archived ${activeFilter}...`}
                />
              </div>
            </section>
            <div className="h-[40vh] overflow-x-auto rounded-md shadow-inner bg-white/95">
              {/* Check if the response from the QUERY is error cause for internet connection etc, will return a ERROR TABLE COMPONENTS */}
              {isError || isUsersError ? (
                <ErrorTable />
              ) : activeFilter === "items" ? (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="sticky -top-4 bg-[#f8fafc]">
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Serial Num
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Image
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Name
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Type
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Model
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Make
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Description
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Category
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Condition
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Bar Code
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        DateTime
                      </th>
                      <th className="bg-[#f8fafc]font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Check if the paginated item is equal to ZERO  */}
                    {paginatedItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={12}
                          className="text-center py-10 text-red-400 font-semibold text-xl"
                        >
                          {archiveItems.length === 0
                            ? <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                {/* <div className="text-6xl mb-4 text-[#64748b]">👥</div> */}
                                <h3 className="mt-14 text-2xl font-semibold text-[#1e293b] mb-2">
                                  No Archived Items
                                </h3>
                                <p className="text-[#64748b] text-lg max-w-md">
                                  Currently, there are no archived items in the system. When items are archived, they will appear here.
                                </p>
                              </div>
                            </div>
                            : "No items match your search criteria"}
                        </td>
                      </tr>
                    ) : (
                      // Mapping all the archived items
                      paginatedItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc] cursor-pointer"
                        >
                          <ArchiveItemTable
                            id={item.id}
                            archivedAt={item.archivedAt}
                            itemName={item.itemName}
                            serialNumber={item.serialNumber}
                            image={item.image}
                            itemType={item.itemType}
                            itemModel={item.itemModel}
                            itemMake={item.itemMake}
                            description={item.description}
                            category={item.category}
                            condition={item.condition}
                            barcodeImage={item.barcodeImage}
                            onRestore={handleRestoreItem}
                            onDelete={handleDelete}
                            isRestoring={restoreMutation.isPending}
                            isDeleting={deleteMutation.isPending}
                          />
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : activeFilter === "users" ? (
                // Users table
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="sticky -top-4 bg-[#f8fafc]">
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        ID
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Full Name
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Username
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Email
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Phone
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Role
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Status
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Check if the paginated data is equal to ZERO  */}
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-10 text-red-400 font-semibold text-xl"
                        >
                          {(() => {
                            // Check if there are any users matching the current filter
                            const hasMatchingUsers = archiveUsers.some(user => {
                              if (activeFilter === "users") {
                                return user.userRole?.toLowerCase() === 'admin' || user.userRole?.toLowerCase() === 'staff';
                              } else if (activeFilter === "teachers") {
                                return user.userRole?.toLowerCase() === 'teacher';
                              } else if (activeFilter === "students") {
                                return user.userRole?.toLowerCase() === 'student';
                              }
                              return false;
                            });

                            if (!hasMatchingUsers) {
                              return (
                                <div className="flex items-center justify-center h-full">
                                  <div className="text-center">
                                    <div className="w-full flex justify-center text-6xl mb-4 text-[#64748b]">
                                      <FaUser />
                                    </div>
                                    <h3 className="mt-14 text-2xl font-semibold text-[#1e293b] mb-2">
                                      No Archived {activeFilter === "users" ? "Users" : activeFilter === "teachers" ? "Teachers" : "Students"}
                                    </h3>
                                    <p className="text-[#64748b] text-lg max-w-md">
                                      Currently, there are no archived {activeFilter === "users" ? "Admin and Staff users" : activeFilter === "teachers" ? "teachers" : "students"} in the system. When {activeFilter === "users" ? "Admin and Staff users" : activeFilter === "teachers" ? "teachers" : "students"} are archived, they will appear here.
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return "No users match your search criteria";
                          })()}
                        </td>
                      </tr>
                    ) : (
                      // Mapping all the archived users
                      paginatedUsers.map((user: TUsers) => (
                        <tr
                          key={user.id}
                          className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc] cursor-pointer"
                        >
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            {user.id}
                          </td>
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            {user.firstName} {user.middleName} {user.lastName}
                          </td>
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            {user.username}
                          </td>
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            {user.email}
                          </td>
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            {user.phoneNumber}
                          </td>
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.userRole === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : user.userRole === 'staff'
                                ? 'bg-purple-100 text-purple-800'
                                : user.userRole === 'teacher'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                              {user.userRole}
                            </span>
                          </td>
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 border-b border-[#e6e6e6] text-[#1e293b] font-medium">
                            <ShowButtonIfUserAdmin onHandleRestoreUser={() => handleRestoreUser(user.id)} onHandleDeleteUser={() => handleDeleteUser(user.id)} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              ) : activeFilter === "teachers" ? (
                // Teachers table
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="sticky -top-4 bg-[#f8fafc]">
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        ID
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Full Name
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Username
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Role
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Status
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Check if the paginated data is equal to ZERO  */}
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-red-400 font-semibold text-xl">
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-full flex justify-center text-6xl mb-4 text-[#64748b]">
                                <FaUser />
                              </div>
                              <h3 className="mt-14 text-2xl font-semibold text-[#1e293b] mb-2">
                                No Archived Teachers
                              </h3>
                              <p className="text-[#64748b] text-lg max-w-md">
                                Currently, there are no archived teachers in the system. When teachers are archived, they will appear here.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user: TUsers) => (
                        <tr key={user.id} className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc] cursor-pointer">
                          <ArchiveTeacherTable
                            id={user.id}
                            firstName={user.firstName}
                            middleName={user.middleName}
                            lastName={user.lastName}
                            username={user.username}
                            userRole={user.userRole}
                            status={user.status}
                            onDelete={() => handleDeleteUser(user.id)}
                            onRestore={() => handleRestoreUser(user.id)}
                            isRestoring={restoreMutation.isPending}
                            isDeleting={deleteMutation.isPending}
                          />
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                // Students table
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="sticky -top-4 bg-[#f8fafc]">
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Student ID
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Full Name
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Course
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Section
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Year
                      </th>

                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Role
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Status
                      </th>
                      <th className="bg-[#f8fafc] font-semibold py-4 px-4 border-b border-[#e6e6e6] text-[#2563eb]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-red-400 font-semibold text-xl">
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-full flex justify-center text-6xl mb-4 text-[#64748b]">
                                <FaUser />
                              </div>
                              <h3 className="mt-14 text-2xl font-semibold text-[#1e293b] mb-2">
                                No Archived Students
                              </h3>
                              <p className="text-[#64748b] text-lg max-w-md">
                                Currently, there are no archived students in the system. When students are archived, they will appear here.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user: TUsers) => (
                        <tr key={user.id} className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc] cursor-pointer">
                          <ArchiveStudentTable
                            id={user.id}
                            firstName={user.firstName}
                            middleName={user.middleName}
                            lastName={user.lastName}
                            userRole={user.userRole}
                            course={user.course}
                            section={user.section}
                            year={user.year}
                            status={user.status}
                            onDelete={() => handleDeleteUser(user.id)}
                            onRestore={() => handleRestoreUser(user.id)}
                            isRestoring={restoreMutation.isPending}
                            isDeleting={deleteMutation.isPending}
                          />
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
      {/* Restore confirmation */}
      {isRestoreConfirmOpen && (
        <PopUpModal
          label={"restore"}
          destination={"inventory list"}
          onHandleCancleAction={handleCancelRestore}
          onHandleConfirmAction={handleConfirmRestoreItem}
        />
      )}
      {/* Delete confirmation */}
      {isDeleteConfirmOpen && (
        <PopUpModalDelete
          label={"delete"}
          onHandleCancleAction={handleCancelDelete}
          onHandleConfirmAction={handleConfirmDelete}
        />
      )}
      {/* User Restore confirmation */}
      {isUserRestoreConfirmOpen && (
        <PopUpModal
          label={"restore"}
          destination={"user management"}
          onHandleCancleAction={handleCancelUserRestore}
          onHandleConfirmAction={handleConfirmRestoreUser}
        />
      )}
      {/* User Delete confirmation */}
      {isUserDeleteConfirmOpen && (
        <PopUpModalDelete
          label={"delete"}
          onHandleCancleAction={handleCancelUserDelete}
          onHandleConfirmAction={handleConfirmDeleteUser}
        />
      )}
    </div>
  );
}
