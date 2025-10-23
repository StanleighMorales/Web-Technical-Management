import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { FormattedDateTime } from "./FormatedDateTime";
import { SlugCondition } from "./SlugCondition";
import { UserData } from "../utils/usersData/userData";
import { type FC } from "react";
import { MdVisibility } from "react-icons/md";

type ArchiveTableProps = {
    id: string;
    archivedAt: string;
    itemName: string;
    serialNumber: string;
    image: string;
    itemType: string;
    itemModel: string;
    itemMake: string;
    description: string;
    category: string;
    condition: string;
    barcodeImage: string;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    isRestoring: boolean;
    isDeleting: boolean;
};

export default function ArchiveItemTable({
    id,
    archivedAt,
    itemName,
    serialNumber,
    image,
    itemType,
    itemModel,
    itemMake,
    description,
    category,
    condition,
    barcodeImage,
    onView,
    onDelete,
    onRestore,
    isRestoring,
    isDeleting
}: ArchiveTableProps) {

    type checkIfUserAdminProps = {
        userRole?: string,
        onHandleRestoreItem: () => void,
        onHandleDeleteItem: () => void
    }
    const data = UserData()


    const ShowButtonIfUserAdmin: FC<checkIfUserAdminProps> = ({ userRole, onHandleRestoreItem, onHandleDeleteItem }) => {
        if (userRole !== "Admin") return null;
        return (
            <>
                <button
                    onClick={onHandleDeleteItem}
                    disabled={isDeleting}
                    title="Delete item"
                    className="text-red-600 text-2xl cursor-pointer mr-2"
                >
                    <FaTrash />
                </button>

                <button
                    onClick={onHandleRestoreItem}
                    disabled={isRestoring}
                    title="Restore item"
                    className="text-orange-300 text-2xl cursor-pointer"
                >
                    <FaTrashRestore />
                </button>
            </>
        )
    }

    return (
        <>
            <td className="py-3 px-4 font-semibold">{serialNumber}</td>
            <td className="py-3 px-4">
                <img
                    src={
                        typeof image === "string" ? image : ""
                    }
                    alt={itemName}
                    className="w-10 h-10 rounded-xl"
                />
            </td>
            <td className="py-3 px-4">{itemName}</td>
            <td className="py-3 px-4">{itemType}</td>
            <td className="py-3 px-4">{itemModel}</td>
            <td className="py-3 px-4">{itemMake}</td>
            <td className="py-3 px-4 max-w-xs truncate" title={description}>
                {description}
            </td>
            <td className="py-3 px-4">{category}</td>
            <td className="py-3 px-4">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${SlugCondition(condition)}`}
                >
                    {condition}
                </span>
            </td>
            <td className="py-3 px-4 font-mono text-sm">
                {barcodeImage && <img
                    src={barcodeImage}
                    alt="Barcode"
                    className="w-14 h-10"
                />}

            </td>
            <td className="py-3 px-4">{FormattedDateTime(archivedAt)}</td>
            <td className="py-3 text-center">
                <button
                    onClick={() => onView(id)}
                    className="mr-2 text-green-500 text-2xl hover:text-green-700 transition-colors"
                    title="View student credentials"
                >
                    <MdVisibility />
                </button>
                <ShowButtonIfUserAdmin
                    userRole={data.userRole}
                    onHandleDeleteItem={() => onDelete(id)}
                    onHandleRestoreItem={() => onRestore(id)}
                />
            </td>

        </>
    );
}
