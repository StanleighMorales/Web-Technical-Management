export default function ActivityLogsSkeletonLoader() {
  return (
    <div className="p-6 md:p-8 max-w-[100rem] mx-auto space-y-8">

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-6 w-36 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-9 w-56 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-full lg:w-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Actor Details", "Action Type", "Target Item", "Status Transition", "Timestamp"].map((col) => (
                  <th key={col} className="px-8 py-5 bg-slate-50/50">
                    <div className="h-3.5 w-24 bg-slate-200 rounded-lg animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-3 w-20 bg-slate-100 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="h-3 w-24 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-16 bg-slate-100 rounded-lg animate-pulse" />
                      <div className="h-5 w-5 rounded-full bg-slate-100 animate-pulse" />
                      <div className="h-6 w-20 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="h-3 w-20 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5 flex items-center justify-between">
          <div className="h-4 w-40 bg-slate-200 rounded-lg animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-9 w-24 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
