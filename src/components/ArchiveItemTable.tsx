import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { FormattedDateTime } from "./FormatedDateTime";
import { SlugCondition } from "./SlugCondition";
import { UserData } from "../utils/usersData/userData";
import { type FC } from "react";
import { MdVisibility } from "react-icons/md";

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
    onView: (id: string) => void;
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
        if (userRole !== "Admin") return null;
        return (
            <>
                <button
                    onClick={onHandleDeleteItem}
                    disabled={props.isDeleting}
                    title="Delete item"
                    className="mr-2 text-2xl text-red-600 cursor-pointer"
                >
                    <FaTrash />
                </button>

                <button
                    onClick={onHandleRestoreItem}
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
                {props.image ? (
                    <img
                        src={props.image}
                        alt={props.itemName}
                        className="object-cover w-10 h-10 rounded-xl"
                        onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-item.png';
                            target.alt = 'Image not available';
                        }}
                    />
                ) : (
                    <div className="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-xl">
                        <span className="text-xs text-gray-500">No Image</span>
                    </div>
                )}
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
                <button
                    onClick={() => props.onView(props.id)}
                    className="mr-2 text-2xl text-green-500 transition-colors hover:text-green-700"
                    title="View student credentials"
                >
                    <MdVisibility />
                </button>
                <ShowButtonIfUserAdmin
                    userRole={data.userRole}
                    onHandleDeleteItem={() => props.onDelete(props.id)}
                    onHandleRestoreItem={() => props.onRestore(props.id)}
                />
            </td>

        </>
    );
}
