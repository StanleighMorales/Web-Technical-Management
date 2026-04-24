export default function ViewItemSkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div className="h-5 w-36 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-9 w-28 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* Image panel */}
            <div className="md:w-72 flex-shrink-0 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center p-8">
              <div className="w-48 h-48 bg-slate-200 rounded-2xl animate-pulse" />
            </div>

            {/* Info panel */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                {/* Label */}
                <div className="h-3.5 w-20 bg-slate-200 rounded-lg animate-pulse" />
                {/* Title */}
                <div className="h-7 w-56 bg-slate-200 rounded-xl animate-pulse" />
                {/* Status badge */}
                <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                {/* Description lines */}
                <div className="space-y-2 pt-1">
                  <div className="h-3.5 w-full bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-3.5 w-4/5 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Chips row */}
              <div className="flex flex-wrap gap-3">
                <div className="h-7 w-28 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-7 w-24 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-7 w-20 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-start gap-3"
            >
              <div className="h-8 w-8 bg-slate-200 rounded-xl animate-pulse flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-3 w-16 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-3">
          <div className="h-8 w-8 bg-slate-200 rounded-xl animate-pulse flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3.5 w-full bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-3.5 w-5/6 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-3.5 w-4/5 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  );
}
