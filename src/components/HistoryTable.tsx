import type { THistoryBorrwedItems } from "../types/types";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugStatus } from "./SlugStatus";

type HistoryTableProps = {
    id: number;
    ItemName: string;
    Borrowed_id: string;
    Teacher: string;
    Room: string;
    Occupied: string;
    Condition: string;
    Event_Date: string;
    Status: string;
    filteredItems: THistoryBorrwedItems[];
};

export default function HistoryTable({
    id,
    ItemName,
    Borrowed_id,
    Teacher,
    Room,
    Occupied,
    Condition,
    Event_Date,
    Status,
    filteredItems,
}: HistoryTableProps) {
    return (
        <>
            {filteredItems.map((_, index) => (
                <tr
                    key={index}
                    className="hover:bg-[#f1f5f9] transition-colors  odd:bg-white even:bg-[#f8fafc]"
                >
                    <td className="py-3 px-6">{id}</td>
                    <td className="py-3 px-6">{ItemName}</td>
                    <td className="py-3 px-6">{Borrowed_id}</td>
                    <td className="py-3 px-6">{Teacher}</td>
                    <td className="py-3 px-6">{Room}</td>
                    <td className="py-3 px-6">{Occupied}</td>
                    <td className="py-3 px-6">{Condition}</td>
                    <td className="py-3 px-6">{FormattedDateTime(Event_Date)}</td>
                    <td className="py-3 px-6">
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${SlugStatus(
                                Status,
                            )}`}
                        >
                            {Status}
                        </span>
                    </td>
                </tr>
            ))}
        </>
    );
}
