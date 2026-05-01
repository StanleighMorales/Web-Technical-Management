import type { FC } from "react";
import { useState } from "react";
import { IoArchive } from "react-icons/io5";
import { useArchiveItem } from "../hooks/itemHooks";
import no_image_svg from "../assets/no-image-svgrepo-com.svg";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugCondition } from "./SlugCondition";
import { SlugStatus } from "./SlugStatus";
import { UserData } from "../utils/usersData/userData";
import PopUpModal from "./PopUpModal";
import { useNavigate } from "@tanstack/react-router";
import type { TItemList } from "../@types/types";
import { showToast } from "./AppToast";

type InventoryTableProps = {
    item: TItemList[];
};

const BLOCKED_STATUSES = ["Borrowed", "Reserved", "Pending", "Archived"];

type ShowButtonIfUserAdminProps = {
    userRole?: string;
    itemStatus?: string;
    onHandleArchive: () => void;
};

const ShowButtonIfUserAdmin: FC<ShowButtonIfUserAdminProps> = ({
    userRole,
    itemStatus,
    onHandleArchive,
}) => {
    if (userRole !== "Admin" && userRole !== "SuperAdmin" && userRole !== "Staff") return null;

    const isBlocked = BLOCKED_STATUSES.some(
        (s) => s.toLowerCase() === itemStatus?.toLowerCase()
    );

    const isAlreadyArchived = itemStatus?.toLowerCase() === "archived";

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (!isBlocked) onHandleArchive();
            }}
            disabled={isBlocked}
            title={
                isAlreadyArchived
                    ? "Item is already archived"
                    : isBlocked
                        ? `Cannot archive — item is currently ${itemStatus}`
                        : "Archive item"
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
            <IoArchive /> Archive
        </button>
    );
};

export const InventoryTable = ({ item }: InventoryTableProps) => {
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const data = UserData();
    const userRole = data.userRole;

    const { mutate, isPending: isArchiving } = useArchiveItem();

    const handleArchive = (id: string) => {
        setSelectedItemId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmArchive = () => {
        if (selectedItemId) {
            mutate(selectedItemId, {
                onSuccess: (data) => {
                    showToast.success("Item Archived", data.message);
                },
                onError: (error) => {
                    showToast.error("Archive Failed", error.message);
                },
            });
            setIsConfirmOpen(false);
        }
    };

    const handleCancelArchive = () => {
        setIsConfirmOpen(false);
        setSelectedItemId(null);
    };

    return (
        <>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="sticky top-0 bg-white/90 backdrop-blur-sm">
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">Serial Number</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">Image</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">Item</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">Category</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">Condition</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">DateTime</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">Status</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {item.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => navigate({ to: `/home/item/$id`, params: { id: row.id } })}
                            className="transition-colors cursor-pointer odd:bg-white even:bg-[#f9fbff] hover:bg-[#f8fafc]"
                        >
                            <td className="py-3 px-4">{row.serialNumber}</td>
                            <td className="py-3 px-4">
                                <img
                                    src={typeof row.image === "string" ? row.image : no_image_svg}
                                    alt={row.itemName}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            </td>
                            <td className="py-3 px-4">{row.itemName}</td>
                            <td className="py-3 px-4">{row.category}</td>
                            <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${SlugCondition(row.condition)}`}>
                                    {row.condition}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span>{FormattedDateTime(row.createdAt)}</span>
                            </td>
                            <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${SlugStatus(row.status)}`}>
                                    {row.status}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <ShowButtonIfUserAdmin
                                    userRole={userRole}
                                    itemStatus={row.status}
                                    onHandleArchive={() => handleArchive(row.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isConfirmOpen && (
                <PopUpModal
                    title="Archive item"
                    label="archive"
                    noun="item"
                    destination="archive"
                    onHandleCancelAction={handleCancelArchive}
                    onHandleConfirmAction={handleConfirmArchive}
                    isLoading={isArchiving}
                />
            )}
        </>
    );
};
