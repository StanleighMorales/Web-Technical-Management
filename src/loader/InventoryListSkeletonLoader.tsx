const Bone = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className ?? ""}`} style={style} />
);

const InventoryListSkeletonLoader = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 md:p-8 space-y-6 max-w-[100rem] mx-auto">

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-3">
                        {/* "Asset management" pill */}
                        <Bone className="h-6 w-36 rounded-full" />
                        {/* Title */}
                        <Bone className="h-10 w-56" />
                        {/* Subtitle */}
                        <Bone className="h-4 w-96 max-w-full" />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Bone className="h-10 w-28 rounded-xl" />
                        <Bone className="h-10 w-10 rounded-xl" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Category badges */}
                    <div className="flex-1 flex gap-2.5 overflow-hidden">
                        {[80, 96, 72, 88, 76].map((w, i) => (
                            <Bone key={i} className={`h-8 w-${w} rounded-full shrink-0`} style={{ width: w }} />
                        ))}
                    </div>
                    {/* Filter dropdowns */}
                    <Bone className="h-9 w-48 rounded-xl shrink-0" />
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

                    {/* Toolbar */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <Bone className="h-4 w-16" />
                            <Bone className="h-3 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Bone className="h-9 w-40 rounded-xl" />
                            <Bone className="h-9 w-44 rounded-xl" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <div className="min-h-[55vh] max-h-[55vh] overflow-y-auto">
                            <table className="w-full">
                                {/* Table head */}
                                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm border-b border-slate-100">
                                    <tr>
                                        {[120, 56, 160, 100, 100, 90, 80, 80].map((w, i) => (
                                            <th key={i} className="px-4 py-3 text-left">
                                                <Bone className="h-3 rounded" style={{ width: w }} />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                {/* Table rows */}
                                <tbody>
                                    {[...Array(8)].map((_, rowIdx) => (
                                        <tr key={rowIdx} className="border-b border-slate-50">
                                            {/* Serial number */}
                                            <td className="px-4 py-3.5">
                                                <Bone className="h-3.5 w-28" />
                                            </td>
                                            {/* Image */}
                                            <td className="px-4 py-3.5">
                                                <Bone className="h-10 w-10 rounded-xl" />
                                            </td>
                                            {/* Item name */}
                                            <td className="px-4 py-3.5">
                                                <Bone className="h-3.5 w-36" />
                                            </td>
                                            {/* Type */}
                                            <td className="px-4 py-3.5">
                                                <Bone className="h-3.5 w-20" />
                                            </td>
                                            {/* Category */}
                                            <td className="px-4 py-3.5">
                                                <Bone className="h-3.5 w-24" />
                                            </td>
                                            {/* Condition badge */}
                                            <td className="px-4 py-3.5">
                                                <Bone className="h-5 w-16 rounded-full" />
                                            </td>
                                            {/* Status badge */}
                                            <td className="px-4 py-3.5">
                                                <Bone className="h-5 w-20 rounded-full" />
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <Bone className="h-8 w-16 rounded-xl" />
                                                    <Bone className="h-8 w-8 rounded-xl" />
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
        </div>
    );
};

export default InventoryListSkeletonLoader;
