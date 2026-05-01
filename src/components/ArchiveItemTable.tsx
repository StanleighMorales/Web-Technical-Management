import { FormattedDateTime } from "./FormattedDateTime";
import { SlugCondition } from "./SlugCondition";
import { UserData } from "../utils/usersData/userData";
import { type FC, useState, useRef, useEffect } from "react";
import no_image_svg from "../assets/no-image-svgrepo-com.svg";
import { LuArchiveRestore } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MoreVertical } from "lucide-react";

type TArchiveTableProps = {
    id: string;
    archivedAt: string;
    itemName: string;
    serialNumber: string;
    image: string | null;
    itemType: string;
    itemModel: string;
    itemMake: string;
    description: string;
    category: string;
    condition: string;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    isRestoring: boolean;
    isDeleting: boolean;
};

type TArchiveItemNewProps = Omit<TArchiveTableProps, "itemType" | "itemModel" | "itemMake">

export const ArchiveItemTable: FC<TArchiveItemNewProps> = (props) => {
    const data = UserData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    const role = data.userRole?.toLowerCase();
    const isAdminOrSuper = role === "admin" || role === "superadmin";
    const isStaff = role === "staff";

    if (!isAdminOrSuper && !isStaff) {
        return (
            <>
                <td className="px-6 py-4 font-medium text-slate-700">{props.serialNumber}</td>
                <td className="px-6 py-4">
                    <img src={typeof props.image === "string" ? props.image : no_image_svg} alt={props.itemName} className="object-cover w-10 h-10 rounded-xl" />
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{props.itemName}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{props.category}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${SlugCondition(props.condition)}`}>{props.condition}</span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{FormattedDateTime(props.archivedAt)}</td>
                <td className="px-6 py-4" />
            </>
        );
    }

    return (
        <>
            <td className="px-6 py-4 font-medium text-slate-700">{props.serialNumber}</td>
            <td className="px-6 py-4">
                <img
                    src={typeof props.image === "string" ? props.image : no_image_svg}
                    alt={props.itemName}
                    className="object-cover w-10 h-10 rounded-xl"
                />
            </td>
            <td className="px-6 py-4 font-medium text-slate-700">{props.itemName}</td>
            <td className="px-6 py-4 font-medium text-slate-700">{props.category}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${SlugCondition(props.condition)}`}>
                    {props.condition}
                </span>
            </td>
            <td className="px-6 py-4 font-medium text-slate-700">{FormattedDateTime(props.archivedAt)}</td>
            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onRestore(props.id);
                                    setIsMenuOpen(false);
                                }}
                                disabled={props.isRestoring}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LuArchiveRestore className="h-4 w-4" />
                                <span className="font-medium">Restore Item</span>
                            </button>

                            {isAdminOrSuper && (
                                <>
                                    <div className="my-1 border-t border-slate-100" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            props.onDelete(props.id);
                                            setIsMenuOpen(false);
                                        }}
                                        disabled={props.isDeleting}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <RiDeleteBin6Line className="h-4 w-4" />
                                        <span className="font-medium">Delete Item</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </td>
        </>
    );
};
