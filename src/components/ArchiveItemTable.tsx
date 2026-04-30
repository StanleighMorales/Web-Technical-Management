import { FormattedDateTime } from "./FormattedDateTime";
import { SlugCondition } from "./SlugCondition";
import { UserData } from "../utils/usersData/userData";
import { type FC } from "react";
import no_image_svg from "../assets/no-image-svgrepo-com.svg";
import { LuArchiveRestore } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

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

    type checkIfUserAdminProps = {
        userRole?: string,
        onHandleRestoreItem: () => void,
        onHandleDeleteItem: () => void
    }

    const data = UserData()

    const ShowButtonIfUserAdmin: FC<checkIfUserAdminProps> = ({ userRole, onHandleRestoreItem, onHandleDeleteItem }) => {
        const role = userRole?.toLowerCase();
        const isAdminOrSuper = role === "admin" || role === "superadmin";
        const isStaff = role === "staff";
        if (!isAdminOrSuper && !isStaff) return null;
        return (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {isAdminOrSuper && (
                    <button
                        onClick={onHandleDeleteItem}
                        disabled={props.isDeleting}
                        title="Delete item"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RiDeleteBin6Line className="h-3.5 w-3.5" /> Delete
                    </button>
                )}
                <button
                    onClick={onHandleRestoreItem}
                    disabled={props.isRestoring}
                    title="Restore item"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LuArchiveRestore className="h-3.5 w-3.5" /> Restore
                </button>
            </div>
        )
    }

    return (
        <>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                {props.serialNumber}
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                <img
                    src={typeof props.image === "string" ? props.image : no_image_svg}
                    alt={props.itemName}
                    className="object-cover w-10 h-10 rounded-xl"
                />
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                {props.itemName}
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                {props.category}
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${SlugCondition(props.condition)}`}>
                    {props.condition}
                </span>
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                {FormattedDateTime(props.archivedAt)}
            </td>
            <td className="py-4 px-4 font-medium border-b border-[#e6e6e6] text-[#1e293b]">
                <ShowButtonIfUserAdmin
                    userRole={data.userRole}
                    onHandleDeleteItem={() => props.onDelete(props.id)}
                    onHandleRestoreItem={() => props.onRestore(props.id)}
                />
            </td>
        </>
    );
}
