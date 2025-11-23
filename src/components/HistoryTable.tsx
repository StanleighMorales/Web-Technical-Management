import type { THistoryBorrwedItems } from "../types/types";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugStatus } from "./SlugStatus";

type HistoryTableProps = {
    items: THistoryBorrwedItems[];
};

export default function HistoryTable({ items }: HistoryTableProps) {
    return (
        <>
            {items.map((item) => (
                <tr
                    key={item.id}
                    className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc]"
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
                </tr>
            ))}
        </>
    );
}
