import { MdVisibility } from "react-icons/md";
import { SlugStatus } from "./SlugStatus";
import type { FC } from "react";
import { FormattedDateTime } from "./FormatedDateTime";

type TRecentBorrowedItemsTableProps = {
  image: null;
  itemName: string;
  serialNumber: string;
  barcode?: null;
  barcodeImage?: null;
  borrowerFullName: string;
  room: string;
  teacherFullName: string;
  subjectTimeSchedule?: string;
  remarks: string | null;
  createdAt: string;
  status: string;
  onSetSelectedId?: (value: string) => void;
  onView?: (value: boolean) => void;
}

type TRecentNewProps = Omit<TRecentBorrowedItemsTableProps, "barcode" | "barcodeImage" | "subjectTimeSchedule">

export const RecentBorrowedItemsTable: FC<TRecentNewProps> = (props) => {

  const handleviewBorrowItemDetails = (id: string) => {
    if (props.onSetSelectedId && props.onView) {
      props.onSetSelectedId(id);
      props.onView(true);
    }
  }

  return (
    <>
      <td className="py-3 px-4">
        {props.serialNumber}
      </td>
      <td className="py-4 px-6">
        <img
          src={typeof props.image === "string" ? props.image : "-"}
          alt={props.itemName}
          className="w-10 h-10 rounded-xl"
        />
      </td>
      <td className="py-4 px-6">
        {props.itemName}
      </td>
      <td className="py-4 px-6">
        {props.borrowerFullName}
      </td>
      <td className="py-4 px-6">
        {props.teacherFullName || "-"}
      </td>
      <td className="py-4 px-6">
        {props.room || "-"}
      </td>
      <td className="py-4 px-6">
        {props.remarks || "-"}
      </td>
      <td className="py-4 px-6">
        {FormattedDateTime(props.createdAt)}
      </td>
      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-sm ${SlugStatus(props.status)}`}
        >
          {props.status}
        </span>
      </td>
      <td className="py-4 px-6 font-semibold">
        <button onClick={() => handleviewBorrowItemDetails(props.serialNumber)}
          className="mr-2 text-2xl text-green-500"
          title="View more"
        >
          <MdVisibility />
        </button>
      </td>
    </>
  );
}
