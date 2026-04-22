import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { TItemList } from "../@types/types";
import { useGetItemInfo } from "../hooks/itemHooks";
import ViewItemSkeletonLoader from "../loader/ViewItemSkeletonLoader";
import { useState } from "react";
import { EditItemForm } from "./EditItemForm";
import { FormattedDateTime } from "./FormattedDateTime";
import box from "../assets/box.webp";
import {
  ArrowLeft,
  Pencil,
  AlertTriangle,
  Hash,
  Wrench,
  CheckCircle,
  Tag,
  Layers,
  Calendar,
  FileText,
  Package,
} from "lucide-react";

export default function ViewItem() {
  const { id } = useParams({ strict: false }) as { id: string };
  const itemId = String(id);
  const [isEditItemFormOpen, setIsEditItemFormOpen] = useState(false);
  const { data, isLoading, error } = useQuery(useGetItemInfo(itemId));

  if (isLoading) return <ViewItemSkeletonLoader />;

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-10 max-w-sm w-full text-center">
          <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-rose-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Unable to Load</h3>
          <p className="text-sm text-slate-500">Failed to load item details. Please try again later.</p>
          <Link
            to="/home/inventory-list"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  const item: TItemList = data;

  const isAvailable = item.status?.toLowerCase() === "available";

  const detailFields = [
    { icon: <Hash className="h-4 w-4" />, color: "bg-indigo-500", label: "Serial Number", value: item.serialNumber },
    { icon: <CheckCircle className="h-4 w-4" />, color: "bg-emerald-500", label: "Condition", value: item.condition },
    { icon: <Tag className="h-4 w-4" />, color: "bg-teal-500", label: "Category", value: item.category },
    { icon: <Wrench className="h-4 w-4" />, color: "bg-blue-500", label: "Item Make", value: item.itemMake },
    { icon: <Layers className="h-4 w-4" />, color: "bg-purple-500", label: "Item Type", value: item.itemType },
    { icon: <Package className="h-4 w-4" />, color: "bg-orange-500", label: "Item Model", value: item.itemModel || "N/A" },
    { icon: <Calendar className="h-4 w-4" />, color: "bg-rose-500", label: "Date Added", value: FormattedDateTime(item.createdAt) },
    ...(item.updatedAt
      ? [{ icon: <Calendar className="h-4 w-4" />, color: "bg-slate-500", label: "Last Updated", value: FormattedDateTime(item.updatedAt) }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <Link
            to="/home/inventory-list"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Inventory
          </Link>
          <button
            type="button"
            onClick={() => setIsEditItemFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Item
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="flex flex-col md:flex-row gap-0">

            {/* Image panel */}
            <div className="md:w-72 flex-shrink-0 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center p-8">
              {item.image ? (
                <img
                  src={typeof item.image === "string" ? item.image : box}
                  alt={item.itemName}
                  className="w-48 h-48 object-cover rounded-2xl shadow-md"
                />
              ) : (
                <img
                  src={box}
                  alt={item.itemName}
                  className="w-48 h-48 object-cover rounded-2xl shadow-md opacity-60"
                />
              )}
            </div>

            {/* Info panel */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                      Item Details
                    </p>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                      {item.itemName}
                    </h1>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {item.status}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-3">
                <Chip label="Category" value={item.category} />
                <Chip label="Condition" value={item.condition} />
                <Chip label="Type" value={item.itemType} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {detailFields.map(({ icon, color, label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-start gap-3"
            >
              <div className={`h-8 w-8 rounded-xl ${color} flex items-center justify-center text-white flex-shrink-0`}>
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                  {value || <span className="text-slate-300 italic font-normal">N/A</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        {item.description && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-700 flex items-center justify-center text-white flex-shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
            </div>
          </div>
        )}
      </div>

      {isEditItemFormOpen && (
        <EditItemForm onClose={() => setIsEditItemFormOpen(false)} id={itemId} />
      )}
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
      <span className="text-xs text-slate-400 font-medium">{label}:</span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}
