export default function BorrowLogsSkeletonLoader() {
  return (
    <div className="p-6 md:p-8 max-w-[100rem] mx-auto space-y-8">

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-6 w-36 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-9 w-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-full lg:w-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-20 bg-slate-200 rounded-full animate-pulse" />
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Borrower", "Item", "Serial No.", "Status", "Borrowed At", "Returned At", "Remarks"].map((col) => (
                  <th key={col} className="px-6 py-4 bg-slate-50/50">
                    <div className="h-3.5 w-20 bg-slate-200 rounded-lg animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-3 w-16 bg-slate-100 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="h-3 w-20 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-24 bg-slate-200 rounded-md animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-14 bg-slate-100 rounded-lg animate-pulse" />
                      <div className="h-4 w-4 rounded-full bg-slate-100 animate-pulse" />
                      <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-3.5 w-24 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="h-3 w-16 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-24 bg-slate-100 rounded-md animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3.5 w-28 bg-slate-100 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="h-4 w-40 bg-slate-200 rounded-lg animate-pulse" />
          <div className="flex items-center gap-1">
            <div className="h-9 w-16 bg-slate-200 rounded-xl animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-9 bg-slate-200 rounded-xl animate-pulse" />
            ))}
            <div className="h-9 w-16 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
