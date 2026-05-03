import { MdAssessment } from "react-icons/md";
import { Construction } from "lucide-react";

export default function Reports() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">

        {/* Icon stack */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="h-24 w-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <MdAssessment className="text-5xl text-indigo-400" />
          </div>
          <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-sm">
            <Construction className="h-4 w-4 text-white" />
          </span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          Under Construction
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
          Reports
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          We're building something useful here — detailed reports on inventory usage, borrowing trends, and user activity. Check back soon.
        </p>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">Coming soon</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Feature previews */}
        <div className="grid grid-cols-1 gap-3 text-left">
          {[
            { label: "Inventory Summary", desc: "Overview of item counts, conditions, and categories" },
            { label: "Borrowing Trends", desc: "Charts on borrow frequency, peak times, and top items" },
            { label: "User Activity", desc: "Per-user borrow history and activity breakdown" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm opacity-60"
            >
              <span className="mt-0.5 h-2 w-2 rounded-full bg-slate-300 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-700">{feature.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
