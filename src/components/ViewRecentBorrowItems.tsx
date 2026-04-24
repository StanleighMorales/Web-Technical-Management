import { useQuery } from "@tanstack/react-query";
import { FormattedDateTime } from "./FormattedDateTime.ts";
import type { TRecentBorrowItemProps } from "../@types/types.ts";
import ErrorTable from "../components/ErrorTables.tsx";
import { useEffect, useState } from "react";
import { useRecentlyBorrowItems } from "../hooks/itemHooks";
import {
  X,
  Package,
  Hash,
  Tag,
  Layers,
  Wrench,
  FileText,
  CheckCircle,
  User,
  DoorOpen,
  Calendar,
  MessageSquare,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { SlugStatus } from "./SlugStatus";

type TViewRecentBorrowItemsProps = {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ViewRecentBorrowItems = ({
  itemId,
  isOpen,
  onClose,
}: TViewRecentBorrowItemsProps) => {
  const [itemData, setItemData] = useState<TRecentBorrowItemProps | null>(null);
  const { data, isPending, isError } = useQuery(useRecentlyBorrowItems(itemId));

  useEffect(() => {
    if (data?.data) setItemData(data.data);
  }, [data]);

  if (!isOpen) return null;

  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex items-center justify-center h-48 gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-slate-500">Loading details...</span>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <ErrorTable />
        </div>
      </div>
    );
  }

  if (!itemData) return null;

  const item = itemData.item;
  const isGuest = itemData.borrowerRole?.toLowerCase() === "guest";
  const isStudent = itemData.borrowerRole?.toLowerCase() === "student";

  const itemFields = [
    { icon: <Hash className="h-3.5 w-3.5" />, label: "Serial Number", value: item.serialNumber, mono: true },
    { icon: <Tag className="h-3.5 w-3.5" />, label: "Category", value: item.category },
    { icon: <Layers className="h-3.5 w-3.5" />, label: "Type", value: item.itemType },
    { icon: <Wrench className="h-3.5 w-3.5" />, label: "Make", value: item.itemMake },
    { icon: <Package className="h-3.5 w-3.5" />, label: "Model", value: item.itemModel },
    { icon: <CheckCircle className="h-3.5 w-3.5" />, label: "Condition", value: item.condition },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="h-4.5 w-4.5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{item.itemName}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Borrow Item Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="sm:w-44 flex-shrink-0 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-4 min-h-[160px]">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-36 object-cover rounded-xl shadow-sm"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-xs font-medium">No image</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <Section title="Item Information" icon={<Package className="h-4 w-4 text-blue-500" />}>
                <Grid>
                  {itemFields.map(({ icon, label, value, mono }) => (
                    <Field key={label} icon={icon} label={label} value={value} mono={mono} />
                  ))}
                  {item.description && (
                    <Field
                      icon={<FileText className="h-3.5 w-3.5" />}
                      label="Description"
                      value={item.description}
                      full
                    />
                  )}
                </Grid>
              </Section>
            </div>
          </div>

          {/* Guest image */}
          {isGuest && itemData.guestImage && (
            <Section title="Borrower Photo" icon={<User className="h-4 w-4 text-violet-500" />}>
              <div className="flex justify-center p-3">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 inline-block">
                  <img
                    src={itemData.guestImage}
                    alt={`${itemData.borrowerFullName} - Guest Photo`}
                    className="max-w-xs max-h-56 object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      const placeholder = target.nextElementSibling as HTMLElement | null;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                  <div className="hidden flex-col items-center gap-2 text-slate-300 py-6 px-10">
                    <ImageIcon className="h-10 w-10" />
                    <span className="text-xs font-medium">Image unavailable</span>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* Guest image placeholder — no image uploaded */}
          {isGuest && !itemData.guestImage && (
            <Section title="Borrower Photo" icon={<User className="h-4 w-4 text-violet-500" />}>
              <div className="flex justify-center p-3">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col items-center gap-2 text-slate-300 min-w-[160px]">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-xs font-medium text-slate-400">No photo provided</span>
                </div>
              </div>
            </Section>
          )}

          {/* Student ID picture */}
          {isStudent && itemData.frontStudentIdPicture && (
            <Section title="Student ID Picture" icon={<User className="h-4 w-4 text-blue-500" />}>
              <div className="flex justify-center p-3">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 inline-block">
                  <img
                    src={itemData.frontStudentIdPicture}
                    alt={`${itemData.borrowerFullName} - Student ID`}
                    className="max-w-xs max-h-56 object-contain rounded-lg shadow-sm"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              </div>
            </Section>
          )}

          <Section title="Borrow Information" icon={<Calendar className="h-4 w-4 text-orange-500" />}>
            <Grid>
              <Field icon={<User className="h-3.5 w-3.5" />} label="Borrower" value={itemData.borrowerFullName} />
              <Field icon={<Tag className="h-3.5 w-3.5" />} label="Role" value={itemData.borrowerRole} />
              <Field icon={<DoorOpen className="h-3.5 w-3.5" />} label="Room" value={itemData.room} />
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Status
                </div>
                <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${SlugStatus(itemData.status)}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {itemData.status}
                </span>
              </div>
              <Field
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Lent At"
                value={itemData.lentAt ? FormattedDateTime(itemData.lentAt) : null}
              />
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Returned At
                </div>
                {itemData.returnedAt ? (
                  <p className="text-sm font-semibold text-emerald-700">
                    {FormattedDateTime(itemData.returnedAt)}
                  </p>
                ) : (
                  <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 mt-0.5">
                    Not returned
                  </span>
                )}
              </div>
              {itemData.remarks && (
                <Field
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                  label="Remarks"
                  value={itemData.remarks}
                  full
                />
              )}
            </Grid>
          </Section>
        </div>
      </div>
    </div>
  );
};

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/60">
        {icon}
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
      {children}
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  mono = false,
  full = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  mono?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`bg-white px-4 py-3.5 flex flex-col gap-1 ${full ? "col-span-full" : ""}`}>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        {icon}
        {label}
      </div>
      <p className={`text-sm font-semibold text-slate-900 ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-slate-300 font-normal italic text-xs">N/A</span>}
      </p>
    </div>
  );
}
