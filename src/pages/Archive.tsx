import { type FC } from "react";
import { FaTrash, FaUser } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useCallback } from "react";
import ArchiveSkeletonLoader from "../loader/ArchiveSkeletonLoader.tsx";
import type { TArchiveItem, TUsers } from "../types/types.ts";
import { useAllItemsArchive } from "../hooks/itemHooks";
import { useDeleteItem } from "../hooks/itemHooks";
import { useRestoreItem } from "../hooks/itemHooks";
import { useAllUsersArchive } from "../hooks/userHooks";
import { useRestoreUser } from "../hooks/userHooks";
import { useDeleteUser } from "../hooks/userHooks";
import ErrorTable from "../components/ErrorTables.tsx";
import SearchBar from "../components/SearchBar.tsx";
import Pagination from "../components/Pagination.tsx";
import PopUpModal from "../components/PopUpModal.tsx";
import PopUpModalDelete from "../components/PopUpModalDelete.tsx";
import { UserData } from "../utils/usersData/userData.ts";
import { FaTrashRestore } from "react-icons/fa";
import { ArchiveItemTable } from "../components/ArchiveItemTable.tsx";
import { ArchiveTeacherTable } from "../components/ArchiveTeacherTable.tsx";
import { ArchiveStudentTable } from "../components/ArchiveStudentTable.tsx";
import ArchiveStudentCredentialsPopup from "../components/ArchiveStudentCredentialsPopup.tsx";
import ArchiveTeacherCredentialsPopup from "../components/ArchiveTeacherCredentialsPopup.tsx";
import ArchiveItemDetailsPopup from "../components/ArchiveItemDetailsPopup.tsx";
import { SuccessAlert } from "../components/SuccessAlert.tsx";

type TStudentTypes = TUsers;
type TNewUserTypes = Omit<TUsers, "course" | "section" | "year">;

export default function Archive() {
    const [ShowAlert, setShowAlert] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<string>("");
    const [archiveItems, setArchiveItems] = useState<TArchiveItem[]>([]);
    const [archiveUsers, setArchiveUsers] = useState<TUsers[]>([]);
    const [searchItem, setSearchItem] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeFilter, setActiveFilter] = useState<
        "items" | "users" | "teachers" | "students"
    >("items");
    const itemsPerPage = 10;
    const userData = UserData();

    const { data, isPending, isError } = useQuery(useAllItemsArchive());
    const {
        data: usersData,
        isPending: isUsersPending,
        isError: isUsersError,
    } = useQuery(useAllUsersArchive());
    const restoreItemMutation = useRestoreItem();
    const deleteItemMutation = useDeleteItem();
    const deleteUserMutation = useDeleteUser();
    const restoreUserMutation = useRestoreUser();
    const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
    const [restoreSelectedItemId, setRestoreSelectedItemId] = useState<
        string | null
    >(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isItemDetailsOpen, setIsItemDetailsOpen] = useState<boolean>(false);
    const [isDeleteConfirmOpen, setIsDeleteItemConfirmOpen] = useState(false);
    const [deleteSelectedId, setDeleteSelectedId] = useState<string | null>(null);
    const [isUserRestoreConfirmOpen, setIsUserRestoreConfirmOpen] =
        useState(false);
    const [userRestoreSelectedId, setUserRestoreSelectedId] = useState<
        string | null
    >(null);
    const [isUserDeleteConfirmOpen, setIsUserDeleteConfirmOpen] = useState(false);
    const [userDeleteSelectedId, setUserDeleteSelectedId] = useState<
        string | null
    >(null);
    const [isStudentCredentialsOpen, setIsStudentCredentialsOpen] =
        useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
        null,
    );
    const [isTeacherCredentialsOpen, setIsTeacherCredentialsOpen] =
        useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
        null,
    );

    // Filter items based on search term and category
    const filteredItems = useMemo(
        () =>
            archiveItems.filter((item) => {
                const searchTerm = searchItem?.toLowerCase() || "";
                const matchesSearch =
                    (item.itemName?.toLowerCase() || "").includes(searchTerm) ||
                    (item.category?.toLowerCase() || "").includes(searchTerm) ||
                    (item.serialNumber?.toLowerCase() || "").includes(searchTerm) ||
                    (item.itemType?.toLowerCase() || "").includes(searchTerm) ||
                    (item.itemModel?.toLowerCase() || "").includes(searchTerm) ||
                    (item.itemMake?.toLowerCase() || "").includes(searchTerm);

                const matchesCategory =
                    selectedCategory === "" || item.category === selectedCategory;

                return matchesSearch && matchesCategory;
            }),
        [archiveItems, searchItem, selectedCategory],
    );

    // Filter users based on search term, userRole, and active filter
    const filteredUsers = useMemo(
        () =>
            archiveUsers.filter((user) => {
                // Filter by active filter (users, teachers, students)
                let roleMatches = false;
                if (activeFilter === "users") {
                    // Show Admin and Staff users
                    roleMatches =
                        user.userRole?.toLowerCase() === "admin" ||
                        user.userRole?.toLowerCase() === "staff";
                } else if (activeFilter === "teachers") {
                    // Show only Teachers
                    roleMatches = user.userRole?.toLowerCase() === "teacher";
                } else if (activeFilter === "students") {
                    // Show only Students
                    roleMatches = user.userRole?.toLowerCase() === "student";
                }

                if (!roleMatches) return false;

                const searchTerm = searchItem?.toLowerCase() || "";
                const matchesSearch =
                    (user.firstName?.toLowerCase() || "").includes(searchTerm) ||
                    (user.lastName?.toLowerCase() || "").includes(searchTerm) ||
                    (user.middleName?.toLowerCase() || "").includes(searchTerm) ||
                    (user.username?.toLowerCase() || "").includes(searchTerm) ||
                    (user.email?.toLowerCase() || "").includes(searchTerm) ||
                    (user.phoneNumber?.toLowerCase() || "").includes(searchTerm) ||
                    (user.userRole?.toLowerCase() || "").includes(searchTerm);

                const matchesRole =
                    selectedCategory === "" || user.userRole === selectedCategory;

                return matchesSearch && matchesRole;
            }),
        [archiveUsers, searchItem, selectedCategory, activeFilter],
    );

    const totalPages = Math.ceil(
        activeFilter === "items"
            ? filteredItems.length / itemsPerPage
            : filteredUsers.length / itemsPerPage,
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

    const handleConfirmRestoreItem = useCallback(() => {
        if (!restoreSelectedItemId) return;
        restoreItemMutation.mutate(restoreSelectedItemId, {
            onSuccess: (data) => {
                setIsRestoreConfirmOpen(false);
                setRestoreSelectedItemId(null);
                setShowAlert(true);
                setShowMessage(data.message);
                setTimeout(() => {
                    setShowAlert(false);
                    setShowMessage("");
                }, 3500);
            },
        });
    }, [restoreItemMutation, restoreSelectedItemId]);

    const handleConfirmDeleteItem = useCallback(() => {
        if (!deleteSelectedId) return;
        deleteItemMutation.mutate(deleteSelectedId, {
            onSuccess: (data) => {
                setIsDeleteItemConfirmOpen(false);
                setDeleteSelectedId(null);
                setShowAlert(true);
                setShowMessage(data.message);
                setTimeout(() => {
                    setShowAlert(false);
                    setShowMessage("");
                }, 3500);
            },
        });
    }, [deleteItemMutation, deleteSelectedId]);

    const handleConfirmRestoreUser = useCallback(() => {
        if (!userRestoreSelectedId) return;
        restoreUserMutation.mutateAsync(userRestoreSelectedId, {
            onSuccess: (data) => {
                setIsUserRestoreConfirmOpen(false);
                setUserRestoreSelectedId(null);
                setShowAlert(true);
                setShowMessage(data.message);
                setTimeout(() => {
                    setShowAlert(false);
                    setShowMessage("");
                }, 3500);
            },
        });
    }, [restoreUserMutation, userRestoreSelectedId]);

    const handleConfirmDeleteUser = useCallback(() => {
        if (!userDeleteSelectedId) return;
        deleteUserMutation.mutateAsync(userDeleteSelectedId, {
            onSuccess: (data) => {
                setIsUserDeleteConfirmOpen(false);
                setUserDeleteSelectedId(null);
                setShowAlert(true);
                setShowMessage(data.message);
                setTimeout(() => {
                    setShowAlert(false);
                    setShowMessage("");
                }, 3500);
            },
        });
    }, [deleteUserMutation, userDeleteSelectedId]);

    useEffect(() => {
        if (data) setArchiveItems(data);
    }, [data]);

    useEffect(() => {
        if (usersData) setArchiveUsers(usersData);
    }, [usersData]);

    if (isPending || isUsersPending) {
        return <ArchiveSkeletonLoader />;
    }

    const viewArchiveItemCredentials = (id: string) => {
        setSelectedItemId(id);
        setIsItemDetailsOpen(true);
    };

    const viewArchiveTeacherCredentials = (id: string) => {
        setSelectedTeacherId(id);
        setIsTeacherCredentialsOpen(true);
    };

    const handleCloseArchiveTeacherCredentials = () => {
        setSelectedTeacherId(null);
        setIsTeacherCredentialsOpen(true);
    };

    const handleArchiveStudentCredentials = (id: string) => {
        setSelectedStudentId(id);
        setIsStudentCredentialsOpen(true);
    };
    const handleCloseStudentCredentials = () => {
        setSelectedStudentId(null);
        setIsStudentCredentialsOpen(false);
    };

    const handleRestoreItem = (id: string) => {
        setRestoreSelectedItemId(id);
        setIsRestoreConfirmOpen(true);
    };

    const handleCancelRestore = () => {
        setIsRestoreConfirmOpen(false);
        setRestoreSelectedItemId(null);
    };

    const handleDeleteItem = (id: string) => {
        setDeleteSelectedId(id);
        setIsDeleteItemConfirmOpen(true);
    };

    const handleCancelDeleteItem = () => {
        setIsDeleteItemConfirmOpen(false);
        setDeleteSelectedId(null);
    };

    const handleRestoreUser = (id: string) => {
        setUserRestoreSelectedId(id);
        setIsUserRestoreConfirmOpen(true);
    };

    const handleCancelUserRestore = () => {
        setIsUserRestoreConfirmOpen(false);
        setUserRestoreSelectedId(null);
    };

    const handleDeleteUser = (id: string) => {
        setUserDeleteSelectedId(id);
        setIsUserDeleteConfirmOpen(true);
    };

    const handleCancelUserDelete = () => {
        setIsUserDeleteConfirmOpen(false);
        setUserDeleteSelectedId(null);
    };

    type checkIfUserAdminProps = {
        onHandleRestoreUser: () => void;
        onHandleDeleteUser: () => void;
    };

    const ShowButtonIfUserAdmin: FC<checkIfUserAdminProps> = ({
        onHandleRestoreUser,
        onHandleDeleteUser,
    }) => {
        if (
            userData.userRole?.toLowerCase() !== "admin" &&
            userData.userRole?.toLowerCase() !== "superadmin"
        )
            return null;
        return (
            <>
                <button
                    onClick={onHandleDeleteUser}
                    title="Delete user"
                    className="mr-2 text-2xl text-red-600 cursor-pointer"
                >
                    <FaTrash />
                </button>

                <button
                    onClick={onHandleRestoreUser}
                    title="Restore user"
                    className="text-2xl text-orange-300 cursor-pointer"
                >
                    <FaTrashRestore />
                </button>
            </>
        );
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-br animate-fadeIn archive-list-container from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
            {ShowAlert && <SuccessAlert message={showMessage} />}
            <header className="flex z-30 flex-col items-center px-8 pt-8 pb-8 shadow-md archive-header bg-white/80">
                <h1 className="mb-2 text-5xl mt-10 lg:mt-0 md:mt-0 font-extrabold tracking-tight text-[#1e293b] drop-shadow-lg">
                    Archived{" "}
                    {activeFilter === "items"
                        ? "Items"
                        : activeFilter === "users"
                            ? "Users"
                            : activeFilter === "teachers"
                                ? "Teachers"
                                : "Students"}
                </h1>
                <p className="mb-6 max-w-2xl text-lg font-medium text-center text-[#64748b]">
                    Manage archived
                    {activeFilter === "items"
                        ? "items"
                        : activeFilter === "users"
                            ? "users"
                            : activeFilter === "teachers"
                                ? "teachers"
                                : "students"}
                    and restore them if needed. View all previously archived{" "}
                    {activeFilter === "items"
                        ? "assets"
                        : activeFilter === "users"
                            ? "accounts"
                            : activeFilter === "teachers"
                                ? "teacher accounts"
                                : "student accounts"}
                    .
                </p>
            </header>

            {/* Filter Buttons */}
            {isError || isUsersError ? (
                ""
            ) : (
                <div className="flex flex-wrap mx-auto gap-4 mt-8 ml-10 md:flex-row lg:flex-row">
                    <button
                        onClick={() => {
                            setActiveFilter("items");
                            setCurrentPage(1);
                            setSearchItem("");
                            setSelectedCategory("");
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeFilter === "items"
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-white text-gray-400 border-2 border-white/30 hover:border-blue-700 hover:text-[#2563eb]"
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
                                ? "bg-blue-500 text-white shadow-lg scale-105"
                                : "bg-white text-gray-400 border-2 border-white/30 hover:border-blue-700  hover:text-[#2563eb]"
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
                                ? "bg-blue-500  text-white shadow-lg scale-105"
                                : "bg-white text-gray-400 border-2 border-white/30 hover:border-blue-700 hover:text-[#2563eb]"
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
                                ? "bg-blue-500  text-white shadow-lg scale-105"
                                : "bg-white text-gray-400 border-2 border-white/30 hover:border-blue-700 hover:text-[#2563eb]"
                            }`}
                    >
                        Students
                    </button>
                </div>
            )}

            <div className="overflow-x-auto mt-8 h-full">
                {/* Archived Items/Users Table */}
                <section className="px-8">
                    <div className="overflow-x-auto py-4 px-4 rounded-3xl border shadow-md bg-white/90 border-[#e0e7ef] lg:h-[55vh]">
                        <section className="flex justify-end mb-4">
                            <div className="flex flex-col gap-2 md:flex-row lg:flex-row">
                                {/* Pagination Component */}
                                {((activeFilter === "items" && filteredItems.length > 0) ||
                                    (activeFilter === "users" && filteredUsers.length > 0)) && (
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
                        <div className="overflow-x-auto rounded-md shadow-inner h-[40vh] bg-white/95">
                            {/* Check if the response from the QUERY is error cause for internet connection etc, will return a ERROR TABLE COMPONENTS */}
                            {isError || isUsersError ? (
                                <ErrorTable />
                            ) : activeFilter === "items" ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="sticky -top-4 bg-[#f8fafc]">
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Serial Num
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Image
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Name
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Category
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Condition
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Bar Code
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                DateTime
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
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
                                                    className="py-10 text-xl font-semibold text-center text-red-400"
                                                >
                                                    {archiveItems.length === 0 ? (
                                                        <div className="flex justify-center items-center h-full">
                                                            <div className="text-center">
                                                                {/* <div className="mb-4 text-6xl text-[#64748b]">👥</div> */}
                                                                <h3 className="mt-14 mb-2 text-2xl font-semibold text-[#1e293b]">
                                                                    No Archived Items
                                                                </h3>
                                                                <p className="max-w-md text-lg text-[#64748b]">
                                                                    Currently, there are no archived items in the
                                                                    system. When items are archived, they will
                                                                    appear here.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center items-center h-full">
                                                            <div className="text-center">
                                                                {/* <div className="mb-4 text-6xl text-[#64748b]">👥</div> */}
                                                                <h3 className="mt-14 mb-2 text-2xl font-semibold text-[#1e293b]">
                                                                    No Archived Items
                                                                </h3>
                                                                <p className="max-w-md text-lg text-[#64748b]">
                                                                    Currently, there are no archived items in the
                                                                    system. When items are archived, they will
                                                                    appear here.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            // Mapping all the archived items
                                            paginatedItems.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => viewArchiveItemCredentials(item.id)}
                                                    title="View more"
                                                    className="transition-colors cursor-pointer odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                                >
                                                    <ArchiveItemTable
                                                        id={item.id}
                                                        archivedAt={item.archivedAt}
                                                        itemName={item.itemName}
                                                        serialNumber={item.serialNumber}
                                                        image={item.image || null}
                                                        description={item.description}
                                                        category={item.category}
                                                        condition={item.condition}
                                                        barcodeImage={item.barcodeImage}
                                                        onRestore={handleRestoreItem}
                                                        onDelete={handleDeleteItem}
                                                        isRestoring={restoreItemMutation.isPending}
                                                        isDeleting={deleteItemMutation.isPending}
                                                    />
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            ) : activeFilter === "users" ? (
                                // Users table
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="sticky top-0 bg-[#f8fafc]">
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                User ID
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Full Name
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Username
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Email
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Phone
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Role
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Status
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
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
                                                    className="py-10 text-xl font-semibold text-center text-red-400"
                                                >
                                                    {filteredUsers.length == 0 && (
                                                        <>
                                                            <div className="flex justify-center items-center h-full">
                                                                <div className="text-center">
                                                                    <div className="flex justify-center mb-4 w-full text-6xl text-[#64748b]">
                                                                        <FaUser />
                                                                    </div>
                                                                    <h3 className="mt-14 mb-2 text-2xl font-semibold text-[#1e293b]">
                                                                        No Archived{" "}
                                                                        {activeFilter === "users"
                                                                            ? "Users"
                                                                            : activeFilter === "teachers"
                                                                                ? "Teachers"
                                                                                : "Students"}
                                                                    </h3>
                                                                    <p className="max-w-md text-lg text-[#64748b]">
                                                                        Currently, there are no archived{" "}
                                                                        {activeFilter === "users"
                                                                            ? "Admin and Staff users"
                                                                            : activeFilter === "teachers"
                                                                                ? "teachers"
                                                                                : "students"}{" "}
                                                                        in the system. When{" "}
                                                                        {activeFilter === "users"
                                                                            ? "Admin and Staff users"
                                                                            : activeFilter === "teachers"
                                                                                ? "teachers"
                                                                                : "students"}{" "}
                                                                        are archived, they will appear here.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            // Mapping all the archived users
                                            paginatedUsers.map((user: TNewUserTypes) => (
                                                <tr
                                                    key={user.id}
                                                    className="transition-colors cursor-pointer odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                                >
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        {user.id}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        {user.firstName} {user.middleName} {user.lastName}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        {user.username}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        {user.email}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        {user.phoneNumber}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${user.userRole === "admin"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : user.userRole === "staff"
                                                                        ? "bg-purple-100 text-purple-800"
                                                                        : user.userRole === "teacher"
                                                                            ? "bg-blue-100 text-blue-800"
                                                                            : "bg-green-100 text-green-800"
                                                                }`}
                                                        >
                                                            {user.userRole}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === "active"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                                                        <ShowButtonIfUserAdmin
                                                            onHandleRestoreUser={() =>
                                                                handleRestoreUser(user.id)
                                                            }
                                                            onHandleDeleteUser={() =>
                                                                handleDeleteUser(user.id)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            ) : activeFilter === "teachers" ? (
                                // Teachers table
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="sticky top-0 bg-[#f8fafc]">
                                                <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                    Teacher ID
                                                </th>
                                                <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                    Full Name
                                                </th>
                                                <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                    Username
                                                </th>
                                                <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                    Role
                                                </th>
                                                <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                    Status
                                                </th>
                                                <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Check if the paginated data is equal to ZERO  */}
                                            {paginatedUsers.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="py-10 text-xl font-semibold text-center text-red-400"
                                                    >
                                                        <div className="flex justify-center items-center h-full">
                                                            <div className="text-center">
                                                                <div className="flex justify-center mb-4 w-full text-6xl text-[#64748b]">
                                                                    <FaUser />
                                                                </div>
                                                                <h3 className="mt-14 mb-2 text-2xl font-semibold text-[#1e293b]">
                                                                    No Archived Teachers
                                                                </h3>
                                                                <p className="max-w-md text-lg text-[#64748b]">
                                                                    Currently, there are no archived teachers in
                                                                    the system. When teachers are archived, they
                                                                    will appear here.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedUsers.map((user: TNewUserTypes) => (
                                                    <tr
                                                        key={user.id}
                                                        onClick={() =>
                                                            viewArchiveTeacherCredentials(user.id)
                                                        }
                                                        className="transition-colors cursor-pointer odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                                    >
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
                                                            isRestoring={restoreUserMutation.isPending}
                                                            isDeleting={deleteUserMutation.isPending}
                                                        />
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Students table
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="sticky top-0 bg-[#f8fafc]">
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Student ID
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Full Name
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Course
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Section
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Year
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Role
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Status
                                            </th>
                                            <th className="py-4 px-4 font-semibold tracking-wider uppercase border-b bg-[#f8fafc]/90 backdrop-blur text-[#64748b]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUsers.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="py-10 text-xl font-semibold text-center text-red-400"
                                                >
                                                    <div className="flex justify-center items-center h-full">
                                                        <div className="text-center">
                                                            <div className="flex justify-center mb-4 w-full text-6xl text-[#64748b]">
                                                                <FaUser />
                                                            </div>
                                                            <h3 className="mt-14 mb-2 text-2xl font-semibold text-[#1e293b]">
                                                                No Archived Students
                                                            </h3>
                                                            <p className="max-w-md text-lg text-[#64748b]">
                                                                Currently, there are no archived students in the
                                                                system. When students are archived, they will
                                                                appear here.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedUsers.map((user: TStudentTypes) => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() =>
                                                        handleArchiveStudentCredentials(user.id)
                                                    }
                                                    className="transition-colors cursor-pointer odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                                >
                                                    <ArchiveStudentTable
                                                        id={user.id}
                                                        firstName={user.firstName}
                                                        middleName={user.middleName}
                                                        lastName={user.lastName}
                                                        course={user.course}
                                                        section={user.section}
                                                        year={user.year}
                                                        userRole={user.userRole}
                                                        status={user.status}
                                                        onDelete={() => handleDeleteUser(user.id)}
                                                        onRestore={() => handleRestoreUser(user.id)}
                                                        isRestoring={restoreUserMutation.isPending}
                                                        isDeleting={deleteUserMutation.isPending}
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
                    title={"Restore Item"}
                    label={"restore"}
                    noun={"item"}
                    destination={"inventory list"}
                    onHandleCancelAction={handleCancelRestore}
                    onHandleConfirmAction={handleConfirmRestoreItem}
                />
            )}
            {/* Delete confirmation */}
            {isDeleteConfirmOpen && (
                <PopUpModalDelete
                    title={"Delete Item"}
                    label={"delete"}
                    onHandleCancelAction={handleCancelDeleteItem}
                    onHandleConfirmAction={handleConfirmDeleteItem}
                />
            )}
            {/* User Restore confirmation */}
            {isUserRestoreConfirmOpen && (
                <PopUpModal
                    title={"Restore Staff"}
                    label={"restore"}
                    noun={"staff"}
                    destination={"User Management"}
                    onHandleCancelAction={handleCancelUserRestore}
                    onHandleConfirmAction={handleConfirmRestoreUser}
                />
            )}
            {/* Student Restore confirmation */}
            {isUserRestoreConfirmOpen && (
                <PopUpModal
                    title={"Restore User"}
                    label={"restore"}
                    noun={"user"}
                    destination={"Registration Module"}
                    onHandleCancelAction={handleCancelUserRestore}
                    onHandleConfirmAction={handleConfirmRestoreUser}
                />
            )}
            {/* User Delete confirmation */}
            {isUserDeleteConfirmOpen && (
                <PopUpModalDelete
                    title={"Delete User"}
                    label={"delete"}
                    onHandleCancelAction={handleCancelUserDelete}
                    onHandleConfirmAction={handleConfirmDeleteUser}
                />
            )}
            {/* Student Credentials Popup */}
            {isStudentCredentialsOpen && selectedStudentId && (
                <ArchiveStudentCredentialsPopup
                    studentId={selectedStudentId}
                    isOpen={isStudentCredentialsOpen}
                    onClose={handleCloseStudentCredentials}
                />
            )}
            {/* Teacher Credentials Popup */}
            {isTeacherCredentialsOpen && selectedTeacherId && (
                <ArchiveTeacherCredentialsPopup
                    teacherId={selectedTeacherId}
                    isOpen={isTeacherCredentialsOpen}
                    onClose={handleCloseArchiveTeacherCredentials}
                />
            )}
            {/* Item Details Popup */}
            {isItemDetailsOpen && selectedItemId && (
                <ArchiveItemDetailsPopup
                    itemId={selectedItemId}
                    isOpen={isItemDetailsOpen}
                    onClose={() => {
                        setIsItemDetailsOpen(false);
                        setSelectedItemId(null);
                    }}
                />
            )}
        </div>
    );
}
