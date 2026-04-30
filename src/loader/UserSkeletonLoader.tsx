export const UserSkeletonLoader = () => {
    return (
        <div className="flex flex-col items-center py-10 px-2 w-full min-h-screen bg-gradient-to-br animate-fadeIn from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
            <div className="relative p-8 w-full rounded-3xl shadow-2xl max-w-[2000px] bg-white/90">
                {/* Header Section Skeleton */}
                <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center">
                    <div>
                        <div className="mb-2 w-80 h-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-96 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Controls Section Skeleton */}
                <section className="flex flex-row justify-between mb-6">
                    <div>
                        <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="flex flex-row gap-4">
                        {/* Select Component Skeleton */}
                        <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </section>

                {/* Staff Table Skeleton */}
                <div className="overflow-x-auto rounded-2xl shadow-lg h-[60vh] bg-white/95">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                                    <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                                    <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(8)].map((_, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                >
                                    <td className="py-3 px-6">
                                        <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex flex-row gap-4">
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Description Skeleton */}
                <div className="mt-6 text-center">
                    <div className="mx-auto w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};
