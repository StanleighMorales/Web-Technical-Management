import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import { SelectHistoryStatus } from "../components/SelectHistoryStatus";
import HistoryListSkeletonLoader from "../loader/HistoryListSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { useBorrowedItemsQuery } from "../query/get/useBorrwedItemsQuery";
import type { THistoryBorrwedItems } from "../types/types";
import HistoryTable from "../components/HistoryTable";
import ErrorTable from "../components/ErrorTables";

const toStatusSlug = (status: string) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("return")) return "returned";
  if (s.includes("overdue")) return "overdue";
  if (s.includes("lost")) return "lost";
  if (s.includes("borrow")) return "borrowed";
  return "default";
};

export default function HistoryList({
  title = "Borrowing History",
  description = "This table lists item borrowing events, including the condition reported and the current status.",
}) {
  const [searchItem, setSearchItem] = useState<string>("");
  const [borrowedItem, setBorrowedItem] = useState<THistoryBorrwedItems[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredItems = useMemo(() => {
    return borrowedItem.filter((item) => {
      const matchesSearch = item.ItemName?.toLowerCase().includes(
        searchItem.toLowerCase(),
      );

      const matchesStatus =
        selectedStatus === "all" ||
        toStatusSlug(item.Status) === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [borrowedItem, searchItem, selectedStatus]);

  const { data, isPending, isError } = useQuery(useBorrowedItemsQuery());

  useEffect(() => {
    if (data) setBorrowedItem(data);
  }, [data]);

  if (isPending) {
    return <HistoryListSkeletonLoader />;
  }

  return (
    <div className="relative flex flex-col items-center py-10 px-2 w-full min-h-screen lg:h-full bg-gradient-to-br animate-fadeIn from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
      <div className="w-full bg-white/90 rounded-2xl p-8 relative">
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-[#1e293b] text-3xl md:text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">{title}</h1>
            <span className="text-lg font-medium text-[#64748b]">
              {description}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-2 justify-end mb-6 flex-wrap">
          {/* Select History Component */}
          <SelectHistoryStatus onChangeStatus={setSelectedStatus} />
          {/* Search Bar Component */}
          <SearchBar
            onChangeValue={(value) => setSearchItem(value)}
            name={"Search History"}
            placeholder={"Search by Borrowed Item"}
          />
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-lg h-[50vh] md:h-[60vh] bg-white/95">
          {isError ? (
            <ErrorTable />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">ID</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Item Name</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Borrowed ID</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Teacher</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Room</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Occupied By</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Condition</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Event Date</th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item: THistoryBorrwedItems) => (
                  <HistoryTable
                    key={item.id}
                    id={item.id}
                    ItemName={item.ItemName}
                    Borrowed_id={item.Borrowed_id}
                    Teacher={item.Teacher}
                    Room={item.Room}
                    Occupied={item.Occupied}
                    Condition={item.Condition}
                    Event_Date={item.Event_Date}
                    Status={toStatusSlug(item.Status)}
                    filteredItems={filteredItems}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-6 text-sm text-center text-[#64748b]">
          <span className="font-semibold">Description:</span> Each row
          represents one history event. <em>Event Date</em> shows when it
          occurred. <em>Condition</em> is the item state reported at that time. <em>Status</em> reflects the latest known state for that borrow record.
        </p>
      </div>
    </div>
  );
}
