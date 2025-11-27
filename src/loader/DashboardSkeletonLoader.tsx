export const DashboardSkeletonLoader = () => {
    return (
        <div className="animate-fadeIn min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe] flex flex-col items-center py-10 px-2">
            {/* Stat Badges Skeleton */}
            <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex flex-col bg-white/90 shadow-xl rounded-2xl p-8 items-center justify-center border border-[#e0e7ef]">
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-12 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="w-full bg-white/90 shadow-xl rounded-2xl p-8 border border-[#e0e7ef]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse -mt-10"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        {/* Paginated Component */}
                        <div className="h-12 w-48 bg-gray-200 rounded animate-pulse -mt-6"></div>
                        {/* Search Bar Component */}
                        <div className="h-12 w-48 bg-gray-200 rounded animate-pulse -mt-6"></div>
                    </div>
                </div>
                <div className="h-[55vh] overflow-x-auto rounded-xl shadow-inner bg-white/95">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr>
                                {[...Array(6)].map((_, index) => (
                                    <th key={index} className="bg-[#f8fafc] sticky top-0 py-4 px-6 border-b border-[#e6e6e6]">
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(10)].map((_, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc]">
                                    {[...Array(6)].map((_, colIndex) => (
                                        <td key={colIndex} className="py-3 px-6">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
