import { useParams, useRouter } from "@tanstack/react-router";
import { useActivityLogById } from "../hooks/logsHooks";
import {
    Activity,
    ArrowLeft,
    ArrowRight,
    Calendar,
    Tag,
    User,
    Package,
    Hash,
    MessageSquare,
    Clock,
    Sparkles,
} from "lucide-react";

const getActionBadge = (action: string) => {
    const act = action?.toLowerCase() ?? "";
    let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
    let dotClass = "bg-slate-500";

    if (act.includes("add") || act.includes("create")) {
        colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
        dotClass = "bg-emerald-500";
    } else if (act.includes("delete") || act.includes("remove") || act.includes("archive")) {
        colorClass = "bg-rose-50 text-rose-700 border-rose-200/60";
        dotClass = "bg-rose-500";
    } else if (act.includes("update") || act.includes("edit")) {
        colorClass = "bg-amber-50 text-amber-700 border-amber-200/60";
        dotClass = "bg-amber-500";
    } else if (act.includes("borrow") || act.includes("lent")) {
        colorClass = "bg-blue-50 text-blue-700 border-blue-200/60";
        dotClass = "bg-blue-500";
    } else if (act.includes("return")) {
        colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200/60";
        dotClass = "bg-indigo-500";
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${colorClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            {action}
        </span>
    );
};

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(d);
};

const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(d);
};

export default function ActivityLogDetail() {
    const { id } = useParams({ strict: false }) as { id: string };
    const router = useRouter();
    const { data, isLoading, isError } = useActivityLogById(id);

    const log = data?.data ?? data;

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-200 opacity-75" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg">
                            <Activity className="h-6 w-6 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-lg font-semibold text-slate-900">Loading Log Details</h3>
                        <p className="text-sm text-slate-500 font-medium">Fetching activity entry...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !log) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-6">
                <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-6">
                        <Activity className="h-8 w-8 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Log Not Found</h3>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        We couldn't load this activity log. It may have been removed or the ID is invalid.
                    </p>
                    <button
                        onClick={() => router.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

            {/* Back button */}
            <button
                onClick={() => router.history.back()}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Activity Logs
            </button>

            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Activity detail</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                    Log Entry
                </h1>
                <p className="text-slate-500 font-medium text-sm font-mono">
                    ID: {log.id}
                </p>
            </div>

            {/* Detail card */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 overflow-hidden">

                {/* Actor section */}
                <div className="px-8 py-6 border-b border-slate-100">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        Actor
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center font-bold text-indigo-700 text-xl shadow-sm border border-indigo-100/50">
                            {log.actorName?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900">{log.actorName}</p>
                            <p className="text-sm text-slate-500 font-medium">{log.actorRole}</p>
                            {log.actorUserId && (
                                <p className="text-xs text-slate-400 font-mono mt-0.5">UID: {log.actorUserId}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100">
                    <div className="px-8 py-6">
                        <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5" />
                            Action
                        </p>
                        {getActionBadge(log.action)}
                    </div>
                    <div className="px-8 py-6">
                        <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                            <ArrowRight className="h-3.5 w-3.5" />
                            Status Transition
                        </p>
                        {(log.previousStatus || log.newStatus) ? (
                            <div className="flex items-center gap-2.5 text-sm font-semibold">
                                {log.previousStatus ? (
                                    <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                        {log.previousStatus}
                                    </span>
                                ) : (
                                    <span className="text-slate-300 italic text-xs">None</span>
                                )}
                                {log.previousStatus && log.newStatus && (
                                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-100">
                                        <ArrowRight className="h-3 w-3 text-slate-400" />
                                    </div>
                                )}
                                {log.newStatus && (
                                    <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                                        {log.newStatus}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-slate-400 text-xs italic">No status change</span>
                        )}
                    </div>
                </div>

                {/* Item details */}
                <div className="px-8 py-6 border-b border-slate-100">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        Item
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">Name</p>
                            <p className="font-semibold text-slate-900">{log.itemName || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                                <Hash className="h-3 w-3" /> Serial Number
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                                {log.itemSerialNumber || "—"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                                <Tag className="h-3 w-3" /> Category
                            </p>
                            <p className="text-sm font-medium text-slate-700">{log.category || "—"}</p>
                        </div>
                    </div>
                    {log.reservedFor && (
                        <div className="mt-4">
                            <p className="text-xs text-slate-400 font-medium mb-1">Reserved For</p>
                            <p className="text-sm font-medium text-slate-700">{log.reservedFor}</p>
                        </div>
                    )}
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100">
                    {[
                        { label: "Created At", value: log.createdAt, icon: Clock },
                        { label: "Borrowed At", value: log.borrowedAt, icon: Calendar },
                        { label: "Returned At", value: log.returnedAt, icon: Calendar },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="px-8 py-6">
                            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </p>
                            {value ? (
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{formatDate(value)}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{formatTime(value)}</p>
                                </div>
                            ) : (
                                <span className="text-slate-300 text-xs italic">—</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Remarks */}
                <div className="px-8 py-6">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Remarks
                    </p>
                    {log.remarks ? (
                        <p className="text-sm text-slate-700 leading-relaxed">{log.remarks}</p>
                    ) : (
                        <span className="text-slate-300 text-xs italic">No remarks</span>
                    )}
                </div>
            </div>
        </div>
    );
}
