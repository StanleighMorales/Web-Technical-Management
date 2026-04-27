import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import { MoreVertical, Pencil, Archive, Ban, CheckCircle, ShieldAlert } from "lucide-react";
import { UserData } from "../utils/usersData/userData";

type StudentTableProps = {
    frontStudentIdPicture?: null,
    backStudentIdPicture?: null,
    studentIdNumber: string,
    phoneNumber: string,
    course: string,
    section: string,
    year: string,
    profilePicture?: null,
    street: string,
    cityMunicipality: string,
    province: string,
    postalCode: string,
    id: string,
    username: string,
    email: string,
    userRole: string,
    status: string,
    isBlocked?: boolean,
    lastName: string,
    middleName: string,
    firstName: string
    onSetEditUserId: (value: string) => void,
    onSetIsEditStudentOpen: (value: boolean) => void;
    onMutate: (value: string) => void;
    onBlockUser?: (value: string) => void;
    onUnblockUser?: (value: string) => void;
};

type TStudentNewTypes = Pick<StudentTableProps, "id" | "studentIdNumber" | "userRole" | "status" | "isBlocked" | "lastName" | "phoneNumber" | "middleName" | "firstName" | "course" | "section" | "year" | "username" | "email" | "onSetIsEditStudentOpen" | "onSetEditUserId" | "onMutate" | "onBlockUser" | "onUnblockUser">

export const StudentTable: FC<TStudentNewTypes> = (props) => {

    const data = UserData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const UserStatus = (status: string) => {
        if (!status) return "bg-red-100 text-gray-700"
        if (status === "Online") return "bg-green-100 text-green-700"
        if (status === "Offline") return "bg-orange-100 text-gray-700"
        return status
    }

    const handleArchiveStudent = () => {
        props.onMutate(props.id);
        setIsMenuOpen(false);
    };

    const handleEditStudent = (id: string) => {
        props.onSetEditUserId(id);
        props.onSetIsEditStudentOpen(true);
        setIsMenuOpen(false);
    }

    const handleBlockUser = () => {
        props.onBlockUser?.(props.id);
        setIsMenuOpen(false);
    }

    const handleUnblockUser = () => {
        props.onUnblockUser?.(props.id);
        setIsMenuOpen(false);
    }

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    type ActionMenuProps = {
        viewerRole?: string;
        targetStatus?: string;
        targetIsBlocked?: boolean;
    };

    const ActionMenu: FC<ActionMenuProps> = ({
        viewerRole,
        targetStatus,
        targetIsBlocked,
    }) => {
        const viewer = viewerRole?.toLowerCase();
        const isAdminOrSuper = viewer === "admin" || viewer === "superadmin";
        const isStaff = viewer === "staff";
        const isOnline = targetStatus?.toLowerCase() === "online";

        // Students are not elevated — staff can archive them
        const canArchive = (isAdminOrSuper || isStaff) && !isOnline;
        
        // Block/Unblock permissions:
        // - Staff can block/unblock Students
        // - Admin and SuperAdmin can also block/unblock Students
        const canBlockUnblock = props.onBlockUser && props.onUnblockUser && (isStaff || isAdminOrSuper);
        
        const canEdit = true; // Everyone can edit (with backend validation)

        // Don't show menu if no permissions
        if (!canArchive && !canBlockUnblock && !canEdit) return null;

        return (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    title="More actions"
                >
                    <MoreVertical className="h-5 w-5" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {/* Edit */}
                        {canEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditStudent(props.id);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="font-medium">Edit Student</span>
                            </button>
                        )}

                        {/* Block/Unblock */}
                        {canBlockUnblock && (
                            targetIsBlocked ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnblockUser();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="font-medium">Unblock Student</span>
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBlockUser();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
                                >
                                    <Ban className="h-4 w-4" />
                                    <span className="font-medium">Block Student</span>
                                </button>
                            )
                        )}

                        {/* Divider if both block and archive are available */}
                        {canBlockUnblock && canArchive && (
                            <div className="my-1 border-t border-slate-100" />
                        )}

                        {/* Archive */}
                        {canArchive && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleArchiveStudent();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
                            >
                                <Archive className="h-4 w-4" />
                                <span className="font-medium">Archive Student</span>
                            </button>
                        )}

                        {/* Disabled archive message */}
                        {!canArchive && isOnline && (isAdminOrSuper || isStaff) && (
                            <div className="px-4 py-2.5 text-xs text-slate-400 italic">
                                Cannot archive online user
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <td className="py-3 px-6 font-medium text-slate-900">{props.firstName}</td>
            <td className="py-3 px-6 font-medium text-slate-900">{props.lastName}</td>
            <td className="py-3 px-6 text-slate-600">{props.username}</td>
            <td className="py-3 px-6 text-slate-600">{props.email}</td>
            <td className="py-3 px-6">
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                    {props.userRole}
                </span>
            </td>
            <td className="py-3 px-6">
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${UserStatus(props.status)}`}
                    >
                        {props.status}
                    </span>
                    {props.isBlocked && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                            <ShieldAlert className="h-3 w-3" />
                            Blocked
                        </span>
                    )}
                </div>
            </td>
            <td className="py-3 px-6 text-right">
                <ActionMenu 
                    viewerRole={data.userRole} 
                    targetStatus={props.status}
                    targetIsBlocked={props.isBlocked}
                />
            </td>
        </>
    );
}
