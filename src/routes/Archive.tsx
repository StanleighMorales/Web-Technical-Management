import { type FC, useState, useRef, useEffect } from "react";
import no_image_svg from "../assets/no-image-svgrepo-com.svg";
import { useMemo, useCallback } from "react";
import ArchiveSkeletonLoader from "../loader/ArchiveSkeletonLoader.tsx";
import type { TUsers } from "../@types/types.ts";
import { useDeleteItem } from "../hooks/itemHooks.ts";
import { useRestoreItem } from "../hooks/itemHooks.ts";
import { useRestoreUser } from "../hooks/userHooks.ts";
import { useDeleteUser } from "../hooks/userHooks.ts";
import ErrorTable from "../components/ErrorTables.tsx";
import SearchBar from "../components/SearchBar.tsx";
import Pagination from "../components/Pagination.tsx";
import PopUpModal from "../components/PopUpModal.tsx";
import PopUpModalDelete from "../components/PopUpModalDelete.tsx";
import { UserData } from "../utils/usersData/userData.ts";
import { ArchiveItemTable } from "../components/ArchiveItemTable.tsx";
import { ArchiveTeacherTable } from "../components/ArchiveTeacherTable.tsx";
import { ArchiveStudentTable } from "../components/ArchiveStudentTable.tsx";
import ArchiveStudentCredentialsPopup from "../components/ArchiveStudentCredentialsPopup.tsx";
import ArchiveTeacherCredentialsPopup from "../components/ArchiveTeacherCredentialsPopup.tsx";
import ArchiveItemDetailsPopup from "../components/ArchiveItemDetailsPopup.tsx";
import { showToast } from "../components/AppToast";
import {
  useAllItemInArchive,
  useAllUsersInArchive,
  useFilteredItems,
  useFilteredUsers,
} from "../data/archive-data.ts";
import { useArchiveState } from "../states/archive-state.ts";
import {
  Archive as ArchiveIcon,
  Package,
  Users,
  GraduationCap,
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuArchiveRestore } from "react-icons/lu";

type TStudentTypes = TUsers;
type TNewUserTypes = Omit<TUsers, "course" | "section" | "year">;

type checkIfUserAdminProps = {
  onHandleRestoreUser: () => void;
  onHandleDeleteUser: () => void;
};

type FilterKey = "items" | "users" | "teachers" | "students";

const filterTabs: { key: FilterKey; label: string; icon: typeof Package }[] = [
  { key: "items", label: "Items", icon: Package },
  { key: "users", label: "Users", icon: Users },
  { key: "teachers", label: "Teachers", icon: BookOpen },
  { key: "students", label: "Students", icon: GraduationCap },
];

const itemsPerPage = 10;

export default function Archive() {
  const {
    searchItem,
    setSearchItem,
    currentPage,
    setCurrentPage,
    isRestoreConfirmOpen,
    setIsRestoreConfirmOpen,
    restoreSelectedItemId,
    setRestoreSelectedItemId,
    selectedItemId,
    setSelectedItemId,
    isItemDetailsOpen,
    setIsItemDetailsOpen,
    isDeleteConfirmOpen,
    setIsDeleteItemConfirmOpen,
    deleteSelectedId,
    setDeleteSelectedId,
    isUserRestoreConfirmOpen,
    setIsUserRestoreConfirmOpen,
    userRestoreSelectedId,
    setUserRestoreSelectedId,
    isUserDeleteConfirmOpen,
    setIsUserDeleteConfirmOpen,
    userDeleteSelectedId,
    setUserDeleteSelectedId,
    isStudentCredentialsOpen,
    setIsStudentCredentialsOpen,
    selectedStudentId,
    setSelectedStudentId,
    isTeacherCredentialsOpen,
    setIsTeacherCredentialsOpen,
    selectedTeacherId,
    setSelectedTeacherId,
  } = useArchiveState();

  const userData = UserData();
  const restoreItemMutation = useRestoreItem();
  const deleteItemMutation = useDeleteItem();
  const deleteUserMutation = useDeleteUser();
  const restoreUserMutation = useRestoreUser();
  const { archiveItems, isPending, isError } = useAllItemInArchive();
  const { isUsersPending, isUsersError } = useAllUsersInArchive();
  const { filteredItems } = useFilteredItems({ searchItem });
  const { filteredUsers, activeFilter, setActiveFilter, setSelectedCategory } =
    useFilteredUsers({ searchItem });

  const totalPages = Math.ceil(
    activeFilter === "items"
      ? filteredItems.length / itemsPerPage
      : filteredUsers.length / itemsPerPage,
  );
  const validCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedItems = useMemo(
    () => filteredItems.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage),
    [filteredItems, validCurrentPage],
  );

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage),
    [filteredUsers, validCurrentPage],
  );

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), [setCurrentPage]);

  // const handleShowAll = useCallback(() => {
  //   setSelectedCategory("");
  //   setCurrentPage(1);
  // }, [setSelectedCategory, setCurrentPage]);

  const handleConfirmRestoreItem = useCallback(() => {
    if (!restoreSelectedItemId) return;
    restoreItemMutation.mutate(restoreSelectedItemId, {
      onSuccess: (data) => {
        setIsRestoreConfirmOpen(false);
        setRestoreSelectedItemId(null);
        showToast.success("Item Restored", data.message);
      },
    });
  }, [restoreItemMutation, restoreSelectedItemId, setIsRestoreConfirmOpen, setRestoreSelectedItemId]);

  const handleConfirmDeleteItem = useCallback(() => {
    if (!deleteSelectedId) return;
    deleteItemMutation.mutate(deleteSelectedId, {
      onSuccess: (data) => {
        setIsDeleteItemConfirmOpen(false);
        setDeleteSelectedId(null);
        showToast.success("Item Deleted", data.message);
      },
    });
  }, [deleteItemMutation, deleteSelectedId, setIsDeleteItemConfirmOpen, setDeleteSelectedId]);

  const handleConfirmRestoreUser = useCallback(() => {
    if (!userRestoreSelectedId) return;
    restoreUserMutation.mutateAsync(userRestoreSelectedId, {
      onSuccess: (data) => {
        setIsUserRestoreConfirmOpen(false);
        setUserRestoreSelectedId(null);
        showToast.success("User Restored", data.message);
      },
    });
  }, [restoreUserMutation, userRestoreSelectedId, setIsUserRestoreConfirmOpen, setUserRestoreSelectedId]);

  const handleConfirmDeleteUser = useCallback(() => {
    if (!userDeleteSelectedId) return;
    deleteUserMutation.mutateAsync(userDeleteSelectedId, {
      onSuccess: (data) => {
        setIsUserDeleteConfirmOpen(false);
        setUserDeleteSelectedId(null);
        showToast.success("User Deleted", data.message);
      },
    });
  }, [deleteUserMutation, userDeleteSelectedId, setIsUserDeleteConfirmOpen, setUserDeleteSelectedId]);

  // Handler helpers
  const viewArchiveItemCredentials = (id: string) => { setSelectedItemId(id); setIsItemDetailsOpen(true); };
  const viewArchiveTeacherCredentials = (id: string) => { setSelectedTeacherId(id); setIsTeacherCredentialsOpen(true); };
  const handleCloseArchiveTeacherCredentials = () => { setSelectedTeacherId(null); setIsTeacherCredentialsOpen(false); };
  const handleArchiveStudentCredentials = (id: string) => { setSelectedStudentId(id); setIsStudentCredentialsOpen(true); };
  const handleCloseStudentCredentials = () => { setSelectedStudentId(null); setIsStudentCredentialsOpen(false); };
  const handleRestoreItem = (id: string) => { setRestoreSelectedItemId(id); setIsRestoreConfirmOpen(true); };
  const handleCancelRestore = () => { setIsRestoreConfirmOpen(false); setRestoreSelectedItemId(null); };
  const handleDeleteItem = (id: string) => { setDeleteSelectedId(id); setIsDeleteItemConfirmOpen(true); };
  const handleCancelDeleteItem = () => { setIsDeleteItemConfirmOpen(false); setDeleteSelectedId(null); };
  const handleRestoreUser = (id: string) => { setUserRestoreSelectedId(id); setIsUserRestoreConfirmOpen(true); };
  const handleCancelUserRestore = () => { setIsUserRestoreConfirmOpen(false); setUserRestoreSelectedId(null); };
  const handleDeleteUser = (id: string) => { setUserDeleteSelectedId(id); setIsUserDeleteConfirmOpen(true); };
  const handleCancelUserDelete = () => { setIsUserDeleteConfirmOpen(false); setUserDeleteSelectedId(null); };

  const UserActionMenu: FC<checkIfUserAdminProps> = ({ onHandleRestoreUser, onHandleDeleteUser }) => {
    const role = userData.userRole?.toLowerCase();
    const isAdminOrSuper = role === "admin" || role === "superadmin";
    const isStaff = role === "staff";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      };
      if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    if (!isAdminOrSuper && !isStaff) return null;

    return (
      <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          title="More actions"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={(e) => { e.stopPropagation(); onHandleRestoreUser(); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <LuArchiveRestore className="h-4 w-4" />
              <span className="font-medium">Restore User</span>
            </button>

            {isAdminOrSuper && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={(e) => { e.stopPropagation(); onHandleDeleteUser(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  <RiDeleteBin6Line className="h-4 w-4" />
                  <span className="font-medium">Delete User</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const activeCount = activeFilter === "items" ? filteredItems.length : filteredUsers.length;
  const activeLabel = filterTabs.find((t) => t.key === activeFilter)?.label ?? "";

  const itemHeaders = ["Serial No.", "Image", "Name", "Category", "Condition", "Archived At"];
  const userHeaders = ["User ID", "Full Name", "Username", "Email", "Phone", "Role", "Status", ""];
  const teacherHeaders = ["Teacher ID", "Full Name", "Username", "Role", "Status"];
  const studentHeaders = ["Student ID", "Full Name", "Course", "Section", "Year", "Role", "Status"];

  const emptyIcon = activeFilter === "items" ? Package : activeFilter === "users" ? Users : activeFilter === "teachers" ? BookOpen : GraduationCap;
  const EmptyIcon = emptyIcon;

  if (isPending || isUsersPending) return <ArchiveSkeletonLoader />;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Archive vault</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Archive
          </h1>
          <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
            View and manage archived {activeLabel.toLowerCase()}. Restore records back to the system or permanently delete them.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex-shrink-0">
          <ArchiveIcon className="h-4 w-4 text-slate-400" />
          <span>{activeCount} archived {activeLabel.toLowerCase()}</span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Toolbar */}
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Filter tabs */}
          {!(isError || isUsersError) && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
              {filterTabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveFilter(key);
                    setCurrentPage(1);
                    setSearchItem("");
                    setSelectedCategory("");
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${activeFilter === key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Search + pagination */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {activeCount > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                totalItems={activeCount}
                itemsPerPage={itemsPerPage}
                handlePageChange={handlePageChange}
              />
            )}
            <SearchBar
              onChangeValue={(value) => setSearchItem(value)}
              name="search"
              placeholder={`Search archived ${activeLabel.toLowerCase()}...`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-h-[65vh] max-h-[55vh] overflow-y-auto">
            {isError || isUsersError ? (
              <ErrorTable />
            ) : (
              <>
                {/* Items */}
                {activeFilter === "items" && (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {itemHeaders.map((h) => (
                          <th key={h} className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                            {h}
                          </th>
                        ))}
                        <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedItems.length === 0 ? (
                        <tr>
                          <td colSpan={itemHeaders.length}>
                            <EmptyState icon={EmptyIcon} label={activeLabel} isEmpty={archiveItems.length === 0} />
                          </td>
                        </tr>
                      ) : (
                        paginatedItems.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((item) => (
                          <tr
                            key={item.id}
                            onClick={() => viewArchiveItemCredentials(item.id)}
                            className="group transition-all duration-200 hover:bg-amber-50/30 cursor-pointer"
                          >
                            <ArchiveItemTable
                              id={item.id}
                              archivedAt={item.createdAt}
                              itemName={item.itemName}
                              serialNumber={item.serialNumber}
                              image={item.image || no_image_svg}
                              description={item.description}
                              category={item.category}
                              condition={item.condition}
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
                )}

                {/* Users */}
                {activeFilter === "users" && (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {userHeaders.map((h) => (
                          <th key={h} className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={userHeaders.length}>
                            <EmptyState icon={EmptyIcon} label={activeLabel} isEmpty={filteredUsers.length === 0} />
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((user: TNewUserTypes) => (
                          <tr key={user.id} className="group transition-all duration-200 hover:bg-amber-50/30">
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{user.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900">{user.firstName} {user.middleName} {user.lastName}</td>
                            <td className="px-6 py-4 text-slate-600">{user.username}</td>
                            <td className="px-6 py-4 text-slate-600">{user.email}</td>
                            <td className="px-6 py-4 text-slate-600">{user.phoneNumber}</td>
                            <td className="px-6 py-4">
                              <RoleBadge role={user.userRole} />
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={user.status} />
                            </td>
                            <td className="px-6 py-4">
                              <UserActionMenu
                                onHandleRestoreUser={() => handleRestoreUser(user.id)}
                                onHandleDeleteUser={() => handleDeleteUser(user.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Teachers */}
                {activeFilter === "teachers" && (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {teacherHeaders.map((h) => (
                          <th key={h} className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                            {h}
                          </th>
                        ))}
                        <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={teacherHeaders.length + 1}>
                            <EmptyState icon={EmptyIcon} label={activeLabel} isEmpty={filteredUsers.length === 0} />
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((user: TNewUserTypes) => (
                          <tr
                            key={user.id}
                            onClick={() => viewArchiveTeacherCredentials(user.id)}
                            className="group transition-all duration-200 hover:bg-amber-50/30 cursor-pointer"
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
                )}

                {/* Students */}
                {activeFilter === "students" && (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {studentHeaders.map((h) => (
                          <th key={h} className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                            {h}
                          </th>
                        ))}
                        <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={studentHeaders.length + 1}>
                            <EmptyState icon={EmptyIcon} label={activeLabel} isEmpty={filteredUsers.length === 0} />
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((user: TStudentTypes) => (
                          <tr
                            key={user.id}
                            onClick={() => handleArchiveStudentCredentials(user.id)}
                            className="group transition-all duration-200 hover:bg-amber-50/30 cursor-pointer"
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isRestoreConfirmOpen && (
        <PopUpModal title="Restore Item" label="restore" noun="item" destination="inventory list"
          onHandleCancelAction={handleCancelRestore} onHandleConfirmAction={handleConfirmRestoreItem}
          isLoading={restoreItemMutation.isPending} />
      )}
      {isDeleteConfirmOpen && (
        <PopUpModalDelete title="Delete Item" label="delete"
          onHandleCancelAction={handleCancelDeleteItem} onHandleConfirmAction={handleConfirmDeleteItem} />
      )}
      {isUserRestoreConfirmOpen && (
        <PopUpModal title="Restore User" label="restore" noun="user" destination="Registration Module"
          onHandleCancelAction={handleCancelUserRestore} onHandleConfirmAction={handleConfirmRestoreUser}
          isLoading={restoreUserMutation.isPending} />
      )}
      {isUserDeleteConfirmOpen && (
        <PopUpModalDelete title="Delete User" label="delete"
          onHandleCancelAction={handleCancelUserDelete} onHandleConfirmAction={handleConfirmDeleteUser} />
      )}
      {isStudentCredentialsOpen && selectedStudentId && (
        <ArchiveStudentCredentialsPopup studentId={selectedStudentId} isOpen={isStudentCredentialsOpen} onClose={handleCloseStudentCredentials} />
      )}
      {isTeacherCredentialsOpen && selectedTeacherId && (
        <ArchiveTeacherCredentialsPopup teacherId={selectedTeacherId} isOpen={isTeacherCredentialsOpen} onClose={handleCloseArchiveTeacherCredentials} />
      )}
      {isItemDetailsOpen && selectedItemId && (
        <ArchiveItemDetailsPopup itemId={selectedItemId} isOpen={isItemDetailsOpen}
          onClose={() => { setIsItemDetailsOpen(false); setSelectedItemId(null); }} />
      )}
    </div>
  );
}

// Shared sub-components

function EmptyState({ icon: Icon, label, isEmpty }: { icon: any; label: string; isEmpty: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
        {isEmpty ? <Icon className="h-8 w-8 text-slate-300" /> : <Search className="h-8 w-8 text-slate-300" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        No Archived {label}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
        {isEmpty
          ? `When ${label.toLowerCase()} are archived, they will appear here.`
          : `No archived ${label.toLowerCase()} match your search. Try adjusting your query.`}
      </p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const r = role?.toLowerCase();
  const cls =
    r === "admin" ? "bg-red-50 text-red-700 border-red-100"
      : r === "staff" ? "bg-violet-50 text-violet-700 border-violet-100"
        : r === "teacher" ? "bg-blue-50 text-blue-700 border-blue-100"
          : "bg-emerald-50 text-emerald-700 border-emerald-100";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const cls =
    s === "active" || s === "online"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}
