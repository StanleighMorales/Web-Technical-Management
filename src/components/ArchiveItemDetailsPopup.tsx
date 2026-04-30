import { useQuery } from "@tanstack/react-query";
import { useGetArchiveItemInfo } from "../hooks/itemHooks";
import { FormattedDateTime } from "./FormattedDateTime.ts";
import ErrorTable from "../components/ErrorTables.tsx";
import {
  X,
  Archive,
  Package,
  Hash,
  Tag,
  Layers,
  Wrench,
  CheckCircle,
  FileText,
  Calendar,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { SlugCondition } from "./SlugCondition";

type TArchiveItemDetailsPopupProps = {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ArchiveItemDetailsPopup({
  itemId,
  isOpen,
  onClose,
}: TArchiveItemDetailsPopupProps) {
  const { data: item, isPending, isError } = useQuery(useGetArchiveItemInfo(itemId));

  if (!isOpen) return null;

  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex items-center justify-center h-48 gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          <span className="text-sm font-medium text-slate-500">Loading details...</span>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <ErrorTable />
        </div>
      </div>
    );
  }

  const detailFields = [
    { icon: <Hash className="h-3.5 w-3.5" />, label: "Serial Number", value: item.serialNumber, mono: true },
    { icon: <Tag className="h-3.5 w-3.5" />, label: "Category", value: item.category },
    { icon: <Layers className="h-3.5 w-3.5" />, label: "Type", value: item.itemType },
    { icon: <Wrench className="h-3.5 w-3.5" />, label: "Make", value: item.itemMake },
    { icon: <Package className="h-3.5 w-3.5" />, label: "Model", value: item.itemModel },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{item.itemName}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Archived Item Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
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
                  {detailFields.map(({ icon, label, value, mono }) => (
                    <Field key={label} icon={icon} label={label} value={value} mono={mono} />
                  ))}
                  <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Condition
                    </div>
                    <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${SlugCondition(item.condition)}`}>
                      {item.condition || "N/A"}
                    </span>
                  </div>
                </Grid>
              </Section>
            </div>
          </div>

          {item.description && (
            <Section title="Description" icon={<FileText className="h-4 w-4 text-slate-500" />}>
              <div className="px-1">
                <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
              </div>
            </Section>
          )}

          <Section title="Archive Information" icon={<Calendar className="h-4 w-4 text-amber-500" />}>
            <div className="grid grid-cols-1 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
              <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  Archived Date
                </div>
                <p className="text-sm font-semibold text-amber-700">
                  {FormattedDateTime(item.archivedAt)}
                </p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

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
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="bg-white px-4 py-3.5 flex flex-col gap-1">
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
