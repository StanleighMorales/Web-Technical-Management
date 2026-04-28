import React from "react";

const Bone = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className ?? ""}`} style={style} />
);

const ActiveBorrowedItemsSkeletonLoader = () => {
  return (
    <div className="h-screen bg-slate-50 flex flex-col p-6 md:p-8 gap-6">
      {/* Header */}
      <div className="shrink-0 space-y-2">
        <Bone className="h-3.5 w-36 rounded-full" />
        <Bone className="h-9 w-72" />
        <Bone className="h-4 w-80 max-w-full" />
      </div>

      {/* Table card */}
      <div className="flex-1 min-h-0 bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="shrink-0 px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <Bone className="h-5 w-48" />
            <Bone className="h-3 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Bone className="h-9 w-40 rounded-xl" />
            <Bone className="h-9 w-44 rounded-xl" />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 overflow-x-auto">
          <div className="h-full overflow-y-auto">
            <table className="w-full">
              {/* Head */}
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm border-b border-slate-100">
                <tr>
                  {[100, 56, 160, 140, 120, 80, 100, 120, 90, 100].map((w, i) => (
                    <th key={i} className="px-6 py-4 text-left">
                      <Bone className="h-3 rounded" style={{ width: w }} />
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Rows */}
              <tbody>
                {[...Array(8)].map((_, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-slate-50">
                    {/* Serial No. */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-24" />
                    </td>
                    {/* Image */}
                    <td className="px-6 py-4">
                      <Bone className="h-10 w-10 rounded-xl" />
                    </td>
                    {/* Item name */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-36" />
                    </td>
                    {/* Occupied By */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-32" />
                    </td>
                    {/* Teacher */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-28" />
                    </td>
                    {/* Room */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-16" />
                    </td>
                    {/* Remarks */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-24" />
                    </td>
                    {/* Lent At */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-28" />
                    </td>
                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <Bone className="h-5 w-20 rounded-full" />
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Bone className="h-7 w-20 rounded-md" />
                        <Bone className="h-4 w-4 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveBorrowedItemsSkeletonLoader;
