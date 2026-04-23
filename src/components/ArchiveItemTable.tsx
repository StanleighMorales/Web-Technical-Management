import { FormattedDateTime } from "./FormattedDateTime";
import { SlugCondition } from "./SlugCondition";
import { UserData } from "../utils/usersData/userData";
import { type FC } from "react";
import box from "../assets/box.webp";
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
        if (userRole !== "Admin" && userRole !== "SuperAdmin") return null;
        return (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onHandleDeleteItem}
                    disabled={props.isDeleting}
                    title="Delete item"
                     className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RiDeleteBin6Line /> Delete
                </button>
                <button
                    onClick={onHandleRestoreItem}
                    disabled={props.isRestoring}
                    title="Restore item"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LuArchiveRestore /> Restore
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
                    src={typeof props.image === "string" ? props.image : box}
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
