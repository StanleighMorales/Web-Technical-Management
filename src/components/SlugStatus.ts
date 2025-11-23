export const SlugStatus = (status: string) => {
  if (!status) return;
  const s = String(status || "").toLowerCase();
  if (s === "available") return "bg-green-100 text-green-700";
  if (s === "returned") return "bg-green-100 text-green-700";
  if (s === "approved") return "bg-emerald-100 text-emerald-700";
  if (s === "borrowed") return "bg-blue-100 text-blue-700";
  if (s === "pending") return "bg-yellow-100 text-yellow-700";
  if (s === "overdue") return "bg-orange-100 text-orange-700";
  if (s === "denied") return "bg-red-100 text-red-700";
  if (s === "canceled") return "bg-gray-100 text-gray-700";
  if (s === "unavailable") return "bg-red-100 text-red-700";

  return status;
};
