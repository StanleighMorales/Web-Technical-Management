const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
    <div className="flex items-center">
      <div className="p-2 bg-gray-200 rounded-lg animate-pulse">
        <div className="w-6 h-6"></div>
      </div>
      <div className="ml-4">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const SkeletonTableRow = ({ cols }: { cols: number }) => (
  <tr className="border-b border-gray-200">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
    ))}
  </tr>
);

const RegistrationModuleSkeletonLoader = () => {
  return (
    <div className="w-full min-h-screen bg-linear-gradient-to-br from-[#f8fafc] to-[#e2e8f0] p-6">
      <div className="w-full max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-80 animate-pulse"></div>
        </div>

        {/* Role Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex flex-wrap gap-2">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="w-full sm:w-64 h-10 bg-gray-200 rounded-lg animate-pulse ml-auto"></div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((row) => (
                  <SkeletonTableRow key={row} cols={5} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModuleSkeletonLoader;
