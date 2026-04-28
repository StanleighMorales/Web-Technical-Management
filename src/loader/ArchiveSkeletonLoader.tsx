import React from "react";

const Bone = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className ?? ""}`} style={style} />
);

const ArchiveSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8">

      {/* ── Page header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          {/* "Archive vault" pill */}
          <Bone className="h-7 w-32 rounded-full" />
          {/* Title */}
          <Bone className="h-10 w-40" />
          {/* Subtitle */}
          <Bone className="h-4 w-96 max-w-full" />
          <Bone className="h-4 w-72 max-w-full" />
        </div>
        {/* Count badge */}
        <Bone className="h-10 w-48 rounded-2xl shrink-0" />
      </div>

      {/* ── Main card ── */}
      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Toolbar */}
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
            {[72, 64, 80, 80].map((w, i) => (
              <Bone key={i} className="h-7 rounded-lg" style={{ width: w }} />
            ))}
          </div>
          {/* Search + pagination */}
          <div className="flex items-center gap-2">
            <Bone className="h-9 w-40 rounded-xl" />
            <Bone className="h-9 w-44 rounded-xl" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-h-[55vh] max-h-[55vh] overflow-y-auto">
            <table className="w-full">
              {/* Head — matches items columns: Serial No., Image, Name, Category, Condition, Archived At, Action, chevron */}
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm border-b border-slate-100">
                <tr>
                  {[100, 56, 160, 100, 90, 120, 80, 32].map((w, i) => (
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
                    {/* Name */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-36" />
                    </td>
                    {/* Category */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-24" />
                    </td>
                    {/* Condition badge */}
                    <td className="px-6 py-4">
                      <Bone className="h-5 w-20 rounded-full" />
                    </td>
                    {/* Archived At */}
                    <td className="px-6 py-4">
                      <Bone className="h-3.5 w-28" />
                    </td>
                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Bone className="h-7 w-16 rounded-md" />
                        <Bone className="h-7 w-20 rounded-md" />
                      </div>
                    </td>
                    {/* Chevron */}
                    <td className="px-6 py-4">
                      <Bone className="h-4 w-4 rounded" />
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

export default ArchiveSkeletonLoader;
