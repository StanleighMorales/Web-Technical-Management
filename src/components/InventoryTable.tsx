import type { FC } from "react";
import { Activity, useState } from "react";
import { IoArchive } from "react-icons/io5";
import { useArchiveItem } from "../hooks/itemHooks";
import box from "../assets/box.webp";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugCondition } from "./SlugCondition";
import { SlugStatus } from "./SlugStatus";
import { UserData } from "../utils/usersData/userData";
import PopUpModal from "./PopUpModal";
import { useNavigate } from "@tanstack/react-router";
import type { TItemList } from "../types/types";
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
} from "@tanstack/react-table";

import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";

type InventoryTableProps = {
    item: TItemList[];
    ShowAlert: boolean;
    ShowMessage: string;
    ShowAlertSuccess: boolean;
    ShowAlertFailed: boolean;
};

type ShowButtonIfUserAdminProps = {
    userRole?: string;
    onHandleArchive: () => void;
};

const ShowButtonIfUserAdmin: FC<ShowButtonIfUserAdminProps> = ({
    userRole,
    onHandleArchive,
}) => {
    if (userRole !== "Admin" && userRole !== "SuperAdmin") return null;
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onHandleArchive();
            }}
            title="Archive item"
            className="text-2xl text-orange-600 transition-colors cursor-pointer hover:text-orange-700"
        >
            <IoArchive />
        </button>
    );
};

export const InventoryTable = ({
    item,
    ShowAlert,
    ShowMessage,
    ShowAlertSuccess,
    ShowAlertFailed,
}: InventoryTableProps) => {
    const navigate = useNavigate();
    const [showAlert] = useState<boolean>(ShowAlert);
    const [showMessage, setShowMessage] = useState<string>(ShowMessage);
    const [showAlertSuccess, setShowAlertSuccess] =
        useState<boolean>(ShowAlertSuccess);
    const [showAlertFailed, setShowAlertFailed] =
        useState<boolean>(ShowAlertFailed);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const data = UserData();
    const userRole = data.userRole;

    const { mutate } = useArchiveItem();

    const handleArchive = (id: string) => {
        setSelectedItemId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmArchive = () => {
        setShowMessage("");
        if (selectedItemId) {
            mutate(selectedItemId, {
                onSuccess: (data) => {
                    setShowAlertSuccess(true);
                    setShowMessage(data.message);

                    setTimeout(() => {
                        setShowAlertSuccess(false);
                        setShowMessage("");
                    }, 3500)
                },
                onError: (error) => {
                    setShowAlertFailed(true);
                    setShowMessage(error.message);
                },
            });
            setIsConfirmOpen(false);
        }
    };

    const handleCancelArchive = () => {
        setIsConfirmOpen(false);
        setSelectedItemId(null);
    };

    const columnHelper = createColumnHelper<TItemList>();
    const columns = [
        columnHelper.accessor("serialNumber", { header: "Serial Number" }),
        columnHelper.accessor("image", {
            header: "Image",
            cell: ({ row }) => (
                <img
                    src={
                        typeof row.original.image === "string" ? row.original.image : box
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
                return <span>{formattedDateTime}</span>;
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
                    onHandleArchive={() => handleArchive(row.original.id)}
                />
            ),
        }),
    ];

    const table = useReactTable({
        data: item,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Activity mode={showAlert ? "visible" : "hidden"}>
                <SuccessAlert message={showMessage} />
            </Activity>

            <Activity mode={showAlertSuccess ? "visible" : "hidden"}>
                <SuccessAlert message={showMessage} />
            </Activity>

            <Activity mode={showAlertFailed ? "visible" : "hidden"}>
                {showAlertFailed && (
                    <ErrorAlert message={showMessage} />
                )}
            </Activity>

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
                            onClick={() => navigate({ to: "/item/$id", params: { id: row.original.id } })}
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
                />
            )}
        </>
    );
};
