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
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
} from "@tanstack/react-table";
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

    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    const columnHelper = createColumnHelper<TItemList>();
    const baseColumns = [
        columnHelper.accessor("serialNumber", { header: "Serial Number" }),
        columnHelper.accessor("image", {
            header: "Image",
            cell: ({ row }) => (
                <img
                    src={
                        typeof row.original.image === "string" ? row.original.image : no_image_svg
                    }
                    alt={row.original.itemName}
                    className="w-12 h-12 object-cover rounded"
                />
            ),
        }),
        columnHelper.accessor("itemName", { header: "Item" }),
        columnHelper.accessor("category", { header: "Category" }),
        columnHelper.accessor("condition", {
            header: "Condition",
            cell: ({ row }) => {
                const colorCondition = SlugCondition(row.original.condition);
                return (
                    <span className={`px-3 py-1 rounded-full text-sm ${colorCondition}`}>
                        {row.original.condition}
                    </span>
                );
            },
        }),
        columnHelper.accessor("createdAt", {
            header: "DateTime",
            cell: ({ row }) => {
                const formattedDateTime = FormattedDateTime(row.original.createdAt);
                return <span>{formattedDateTime?.replace("/" , "-")}</span>;
            },
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: ({ row }) => {
                const colorClass = SlugStatus(row.original.status);
                return (
                    <span className={`px-3 py-1 rounded-full text-sm ${colorClass}`}>
                        {row.original.status}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: "action",
            header: "Action",
            cell: ({ row }) => (
                <ShowButtonIfUserAdmin
                    userRole={userRole}
                    itemStatus={row.original.status}
                    onHandleArchive={() => handleArchive(row.original.id)}
                />
            ),
        }),
    ];

    const columns = isAdmin ? baseColumns : baseColumns;

    const table = useReactTable({
        data: item,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <table className="w-full text-left border-collapse">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className="sticky top-0 bg-white/90 backdrop-blur-sm"
                        >
                            {headerGroup.headers.map((header: any) => (
                                <th
                                    key={header.id}
                                    className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]"
                                >
                                    {header.isPlaceholder ? null : header.column.columnDef.header}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => navigate({ to: `/home/item/$id`, params: { id: row.original.id } })}
                            className="transition-colors cursor-pointer odd:bg-white even:bg-[#f9fbff] hover:bg-[#f8fafc]"
                        >
                            {row.getVisibleCells().map((cell: any) => (
                                <td className="py-3 px-4" key={cell.id}>
                                    {cell.column.columnDef.cell
                                        ? cell.column.columnDef.cell(cell.getContext())
                                        : cell.renderValue()}
                                </td>
                            ))}
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
