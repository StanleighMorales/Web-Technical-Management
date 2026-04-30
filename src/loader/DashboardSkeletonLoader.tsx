const Bone = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className ?? ""}`} style={style} />
);

export const DashboardSkeletonLoader = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Bone className="h-3 w-16 rounded-full" />
                    <Bone className="h-8 w-40" />
                    <Bone className="h-3.5 w-72 max-w-full" />
                </div>
                <div className="flex items-center gap-3">
                    <Bone className="h-9 w-52 rounded-xl" />
                    <Bone className="h-9 w-44 rounded-xl" />
                </div>
            </div>

            {/* ── Badge cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="relative bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 overflow-hidden">
                        {/* accent bar */}
                        <Bone className="absolute inset-x-0 top-0 h-1 rounded-none rounded-t-2xl" />
                        <div className="space-y-3 pt-2">
                            <Bone className="h-3 w-24" />
                            <Bone className="h-8 w-16" />
                            <Bone className="h-3 w-20" />
                        </div>
                        {/* icon overlay */}
                        <Bone className="absolute top-4 right-4 h-9 w-9 rounded-xl" />
                    </div>
                ))}
            </div>

            {/* ── Table card ─────────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

                {/* Toolbar */}
                <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <Bone className="h-4 w-48" />
                        <Bone className="h-3 w-36" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-slate-100">
                            <tr>
                                {[100, 56, 140, 120, 100, 80, 100, 90, 80, 40].map((w, i) => (
                                    <th key={i} className="px-6 py-4 bg-slate-50/80 text-left">
                                        <Bone className="h-3 rounded" style={{ width: w }} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, rowIdx) => (
                                <tr key={rowIdx} className="border-b border-slate-50">
                                    {/* Serial No. */}
                                    <td className="px-6 py-4"><Bone className="h-3.5 w-24" /></td>
                                    {/* Image */}
                                    <td className="px-6 py-4"><Bone className="h-10 w-10 rounded-xl" /></td>
                                    {/* Item name */}
                                    <td className="px-6 py-4"><Bone className="h-3.5 w-32" /></td>
                                    {/* Occupied by */}
                                    <td className="px-6 py-4"><Bone className="h-3.5 w-28" /></td>
                                    {/* Teacher */}
                                    <td className="px-6 py-4"><Bone className="h-3.5 w-24" /></td>
                                    {/* Room */}
                                    <td className="px-6 py-4"><Bone className="h-3.5 w-16" /></td>
                                    {/* Remarks */}
                                    <td className="px-6 py-4"><Bone className="h-3.5 w-20" /></td>
                                    {/* Lent At */}
                                    <td className="px-6 py-4"><Bone className="h-3.5 w-20" /></td>
                                    {/* Status */}
                                    <td className="px-6 py-4"><Bone className="h-5 w-16 rounded-full" /></td>
                                    {/* Chevron */}
                                    <td className="px-6 py-4"><Bone className="h-4 w-4 rounded" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
