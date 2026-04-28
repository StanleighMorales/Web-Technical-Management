export default function SettingsSkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page title */}
        <div>
          <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-200 rounded animate-pulse mt-2" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left panel ── */}
          <div className="lg:w-72 shrink-0 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center gap-3">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-full bg-slate-200 animate-pulse" />

              {/* Name + username */}
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
                <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
              </div>

              {/* Pills */}
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-5 w-16 bg-slate-200 rounded-full animate-pulse" />
              </div>

              {/* Edit button */}
              <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse mt-1" />
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="flex-1 space-y-4">

            {/* Personal Information section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <FieldSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Account Information section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-44 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <FieldSkeleton key={i} badge={i >= 2} />
                  ))}
                </div>
              </div>
            </div>

            {/* Account Status bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-56 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-4 w-14 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldSkeleton({ badge = false }: { badge?: boolean }) {
  return (
    <div className="bg-white px-4 py-3.5 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
      </div>
      {badge ? (
        <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
      ) : (
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
      )}
    </div>
  );
}
