import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, Tag, Layers, Loader2 } from "lucide-react";
import { showToast } from "./AppToast";
import {
  useGetCategories,
  useGetConditions,
  useAddCategory,
  useDeleteCategory,
  useAddCondition,
  useDeleteCondition,
} from "../hooks/inventorySettingsHooks";

type LookupPanelProps = {
  title: string;
  saveLabel: string;
  icon: React.ReactNode;
  items: string[];
  isLoading: boolean;
  isAdding: boolean;
  isDeleting: boolean;
  onAdd: (name: string) => void;
  onDelete: (name: string) => void;
  placeholder: string;
};

function LookupPanel({
  title,
  saveLabel,
  icon,
  items,
  isLoading,
  isAdding,
  isDeleting,
  onAdd,
  onDelete,
  placeholder,
}: LookupPanelProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (items.map((i) => i.toLowerCase()).includes(trimmed.toLowerCase())) {
      showToast.error("Duplicate", `"${trimmed}" already exists.`);
      return;
    }
    onAdd(trimmed);
    setInput("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isLoading ? "Loading…" : `${items.length} ${items.length === 1 ? "entry" : "entries"}`}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Add input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder={placeholder}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding || !input.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {saveLabel}
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-10 w-10 rounded-full flex items-center justify-center mb-3 bg-blue-50 text-blue-400">
              {icon}
            </div>
            <p className="text-sm font-semibold text-slate-700">No {title.toLowerCase()} yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Add your first one above.</p>
          </div>
        ) : (
          <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="h-2 w-2 rounded-full shrink-0 bg-blue-500" />
                  <span className="text-sm font-medium text-slate-800 truncate">{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  disabled={isDeleting}
                  title={`Delete ${item}`}
                  className="shrink-0 h-7 w-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function InventorySettings() {
  const { data: categories = [], isLoading: catLoading } = useQuery(useGetCategories());
  const { data: conditions = [], isLoading: conLoading } = useQuery(useGetConditions());

  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();
  const addCondition = useAddCondition();
  const deleteCondition = useDeleteCondition();

  const handleAddCategory = (name: string) => {
    addCategory.mutate(name, {
      onSuccess: () => showToast.success("Category Added", `"${name}" has been added.`),
      onError: (err) => showToast.error("Failed", err.message),
    });
  };

  const handleDeleteCategory = (name: string) => {
    deleteCategory.mutate(name, {
      onSuccess: () => showToast.success("Category Removed", `"${name}" has been removed.`),
      onError: (err) => showToast.error("Failed", err.message),
    });
  };

  const handleAddCondition = (name: string) => {
    addCondition.mutate(name, {
      onSuccess: () => showToast.success("Condition Added", `"${name}" has been added.`),
      onError: (err) => showToast.error("Failed", err.message),
    });
  };

  const handleDeleteCondition = (name: string) => {
    deleteCondition.mutate(name, {
      onSuccess: () => showToast.success("Condition Removed", `"${name}" has been removed.`),
      onError: (err) => showToast.error("Failed", err.message),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LookupPanel
          title="Categories"
          saveLabel="Save Category"
          icon={<Tag className="h-4 w-4" />}
          items={categories}
          isLoading={catLoading}
          isAdding={addCategory.isPending}
          isDeleting={deleteCategory.isPending}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
          placeholder="e.g. Electronics"
        />
        <LookupPanel
          title="Conditions"
          saveLabel="Save Condition"
          icon={<Layers className="h-4 w-4" />}
          items={conditions}
          isLoading={conLoading}
          isAdding={addCondition.isPending}
          isDeleting={deleteCondition.isPending}
          onAdd={handleAddCondition}
          onDelete={handleDeleteCondition}
          placeholder="e.g. Good"
        />
      </div>
    </div>
  );
}
