import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugCondition } from "./SlugCondition";
import { UserData } from "../utils/usersData/userData";
import { type FC } from "react";
import box from "../assets/box.webp";

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
    barcodeImage: string;
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
            <>
                <button
                    onClick={(e) => { e.stopPropagation(); onHandleDeleteItem(); }}
                    disabled={props.isDeleting}
                    title="Delete item"
                    className="mr-2 text-2xl text-red-600 cursor-pointer"
                >
                    <FaTrash />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onHandleRestoreItem(); }}
                    disabled={props.isRestoring}
                    title="Restore item"
                    className="text-2xl text-orange-300 cursor-pointer"
                >
                    <FaTrashRestore />
                </button>
            </>
        )
    }

    return (
        <>
            <td className="py-3 px-4 font-semibold">{props.serialNumber}</td>
            <td className="py-3 px-4">
                <img
                    src={typeof props.image === "string" ? props.image : box}
                    alt={props.itemName}
                    className="object-cover w-10 h-10 rounded-xl"
                />
            </td>
            <td className="py-3 px-4">{props.itemName}</td>
            <td className="py-3 px-4">{props.category}</td>
            <td className="py-3 px-4">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${SlugCondition(props.condition)}`}
                >
                    {props.condition}
                </span>
            </td>
            <td className="py-3 px-4 font-mono text-sm">
                {props.barcodeImage && <img
                    src={props.barcodeImage}
                    alt="Barcode"
                    className="w-14 h-10"
                />}

            </td>
            <td className="py-3 px-4">{FormattedDateTime(props.archivedAt)}</td>
            <td className="py-3 text-center">
                <ShowButtonIfUserAdmin
                    userRole={data.userRole}
                    onHandleDeleteItem={() => props.onDelete(props.id)}
                    onHandleRestoreItem={() => props.onRestore(props.id)}
                />
            </td>

        </>
    );
}
