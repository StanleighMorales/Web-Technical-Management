import type { THistoryBorrwedItems } from "../types/types";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugStatus } from "./SlugStatus";

type PendingItemsTableProps = {
    items: THistoryBorrwedItems[];
    onApprove: (item: THistoryBorrwedItems) => void;
    onRowClick: (itemId: string) => void;
};

export default function PendingItemsTable({ items, onApprove, onRowClick }: PendingItemsTableProps) {
    return (
        <>
            {items.filter((s) => s.status === "Pending").map((item) => (
                <tr
                    key={item.id}
                    onClick={() => onRowClick(item.id)}
                    className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc] cursor-pointer"
                >
                    <td className="py-3 px-4">{item.item.serialNumber}</td>
                    <td className="py-4 px-6">
                        <img
                            src={typeof item.item.image === "string" ? item.item.image : "-"}
                            alt={item.borrowerFullName}
                            className="object-cover w-10 h-10 rounded-xl"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    </td>
                    <td className="py-4 px-6">{item.item.itemName}</td>
                    <td className="py-4 px-6">{item.borrowerFullName}</td>
                    <td className="py-4 px-6">{item.teacherFullName || "-"}</td>
                    <td className="py-4 px-6">{item.room || "-"}</td>
                    <td className="py-4 px-6">{item.remarks || "-"}</td>
                    <td className="py-4 px-6">{FormattedDateTime(item.item.createdAt)}</td>
                    <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${SlugStatus((item.status))}`}>
                            {item.status}
                        </span>
                    </td>
                    <td className="py-4 px-6">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onApprove(item);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                        >
                            Approve
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
}
