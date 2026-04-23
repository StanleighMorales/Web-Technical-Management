import { useState } from "react";
import { useActivityLogs } from "../hooks/logsHooks";
import { useNavigate } from "@tanstack/react-router";
import { Search, Activity, Calendar, User, Tag, ArrowRight, Sparkles } from "lucide-react";
import type { TActivityLogs } from "../@types/types";
import ActivityLogsSkeletonLoader from "../loader/ActivityLogsSkeletonLoader";

export default function ActivityLogs() {
    const { data: logs, isLoading, isError } = useActivityLogs();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const filteredLogs = logs?.data.filter((log: TActivityLogs) =>
        log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionBadge = (action: string) => {
        const act = action.toLowerCase();
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
                <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`}></span>
                {action}
            </span>
        );
    };

    if (isLoading) {
        return <ActivityLogsSkeletonLoader />;
    }

    if (isError) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-6">
                <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-6">
                        <Activity className="h-8 w-8 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Connection Issue</h3>
                    <p className="text-slate-500 mb-6 leading-relaxed">We encountered a problem while trying to fetch the activity history. Please check your connection and try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-200"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-[100rem] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Real-time tracking</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                        Activity Logs
                    </h1>
                    <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
                        Monitor comprehensive system actions, track inventory movements, and audit user activity with complete visibility.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 w-full lg:w-auto">
                    <div className="relative group flex-grow lg:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by actor, action, or item..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm hover:border-slate-300 hover:shadow-md"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 overflow-hidden relative backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/50 pointer-events-none -z-10"></div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-8 py-5 text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-50/50">Actor Details</th>
                                <th className="px-8 py-5 text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-50/50">Action Type</th>
                                <th className="px-8 py-5 text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-50/50">Target Item</th>
                                <th className="px-8 py-5 text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-50/50">Status Transition</th>
                                <th className="px-8 py-5 text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-50/50">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs && filteredLogs.length > 0 ? (
                                filteredLogs.map((log: TActivityLogs) => (
                                    <tr
                                        key={log.id}
                                        onClick={() => navigate({ to: "/home/activity-logs/$id", params: { id: log.id } })}
                                        className="group transition-all duration-300 hover:bg-indigo-50/30 relative cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-11 w-11 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center font-bold text-indigo-700 shadow-sm border border-indigo-100/50 group-hover:scale-105 transition-transform duration-300">
                                                    {log.actorName.charAt(0).toUpperCase()}
                                                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {log.actorName}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        {log.actorRole}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">{log.itemName}</span>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {log.itemSerialNumber && (
                                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                            <Tag className="h-3 w-3 text-slate-400" />
                                                            {log.itemSerialNumber}
                                                        </span>
                                                    )}
                                                    {log.category && (
                                                        <span className="text-xs font-medium text-slate-400">{log.category}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {(log.previousStatus || log.newStatus) ? (
                                                <div className="flex items-center gap-2.5 text-xs font-semibold">
                                                    {log.previousStatus ? (
                                                        <span className="text-slate-500">
                                                            {log.previousStatus}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 italic">None</span>
                                                    )}

                                                    {log.previousStatus && log.newStatus && (
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-100">
                                                            <ArrowRight className="h-3 w-3 text-slate-400" />
                                                        </div>
                                                    )}

                                                    {log.newStatus && (
                                                        <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                                            {log.newStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center text-slate-400 text-xs font-medium italic bg-slate-50 px-2 py-1 rounded-md">
                                                    No status change
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold text-slate-700">
                                                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(log.createdAt))}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                    {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(log.createdAt))}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20">
                                        <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                                                <Search className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">No logs found</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                We couldn't find any activity logs matching your search criteria. Try adjusting your filters.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5 flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-900">{filteredLogs?.length || 0}</span> activity entries
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-xl text-slate-500 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-50 disabled:pointer-events-none" disabled>Previous</button>
                        <button className="px-4 py-2 rounded-xl text-indigo-600 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-indigo-100 transition-all disabled:opacity-50 disabled:pointer-events-none" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
