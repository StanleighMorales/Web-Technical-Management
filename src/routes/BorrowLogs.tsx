import { useState, useMemo } from "react";
import { useBorrowLogs } from "../hooks/logsHooks";
import {
    Search,
    BookOpen,
    Calendar,
    User,
    ArrowRight,
    Package,
    Hash,
    Clock,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import type { TBorrowingLogs } from "../@types/types";
import BorrowLogsSkeletonLoader from "../loader/BorrowLogsSkeletonLoader";
import BorrowLogsDetailModal from "../components/BorrowLogsDetailModal";

const ITEMS_PER_PAGE = 10;

const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() ?? "";
    let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
    let dotClass = "bg-slate-400";

    if (s === "borrowed" || s === "lent") {
        colorClass = "bg-blue-50 text-blue-700 border-blue-200/60";
        dotClass = "bg-blue-500";
    } else if (s === "returned") {
        colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
        dotClass = "bg-emerald-500";
    } else if (s === "reserved") {
        colorClass = "bg-amber-50 text-amber-700 border-amber-200/60";
        dotClass = "bg-amber-500";
    } else if (s === "overdue") {
        colorClass = "bg-rose-50 text-rose-700 border-rose-200/60";
        dotClass = "bg-rose-500";
    } else if (s === "available") {
        colorClass = "bg-teal-50 text-teal-700 border-teal-200/60";
        dotClass = "bg-teal-500";
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm ${colorClass}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            {status}
        </span>
    );
};

const getRoleBadge = (role: string) => {
    const r = role?.toLowerCase() ?? "";
    if (r === "student") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">
                Student
            </span>
        );
    }
    if (r === "teacher" || r === "faculty") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
                {role}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
            {role}
        </span>
    );
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(d);
};

const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(d);
};

const getInitials = (name: string | null) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const avatarGradients = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-cyan-600",
];

const getAvatarGradient = (name: string | null) => {
    if (!name) return avatarGradients[0];
    const idx = name.charCodeAt(0) % avatarGradients.length;
    return avatarGradients[idx];
};

export default function BorrowLogs() {
    const { data: logsData, isLoading, isError } = useBorrowLogs();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal state
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<TBorrowingLogs | null>(null);

    const logs: TBorrowingLogs[] = logsData?.data ?? logsData ?? [];

    const statusOptions = useMemo(() => {
        const statuses = Array.from(
            new Set(logs.map((l: TBorrowingLogs) => l.currentStatus).filter(Boolean))
        );
        return ["All", ...statuses];
    }, [logs]);

    const filtered = useMemo(() => {
        return logs.filter((log: TBorrowingLogs) => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                !term ||
                log.borrowerName?.toLowerCase().includes(term) ||
                log.itemName?.toLowerCase().includes(term) ||
                log.itemSerialNumber?.toLowerCase().includes(term) ||
                log.studentIdNumber?.toLowerCase().includes(term) ||
                log.borrowerRole?.toLowerCase().includes(term);
            const matchesStatus =
                statusFilter === "All" || log.currentStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [logs, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleStatusFilter = (s: string) => {
        setStatusFilter(s);
        setCurrentPage(1);
    };

    const handleRowClick = (log: TBorrowingLogs) => {
        setSelectedLog(log);
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedLog(null);
    };

    if (isLoading) {
        return <BorrowLogsSkeletonLoader />;
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (isError) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-6">
                <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-6">
                        <BookOpen className="h-8 w-8 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Connection Issue</h3>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        We couldn't fetch the borrow logs. Please check your connection and try again.
                    </p>
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

    // ── Main ─────────────────────────────────────────────────────────────────
    return (
        <div className="p-6 md:p-8 max-w-[100rem] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                        Borrow Logs
                    </h1>
                    <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
                        Track every item borrowing event — who borrowed what, when it was returned, and the full status trail.
                    </p>
                </div>

                {/* Search */}
                <div className="relative group w-full lg:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by borrower, item, serial no..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:border-slate-300 hover:shadow-md"
                    />
                </div>
            </div>

            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2">
                {statusOptions.map((s) => (
                    <button
                        key={s}
                        onClick={() => handleStatusFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            statusFilter === s
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Table card */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/50 pointer-events-none -z-10" />

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {[
                                    { icon: User, label: "Borrower" },
                                    { icon: Package, label: "Item" },
                                    { icon: Hash, label: "Serial No." },
                                    { icon: ArrowRight, label: "Status" },
                                    { icon: Clock, label: "Borrowed At" },
                                    { icon: Clock, label: "Returned At" },
                                    { icon: MessageSquare, label: "Remarks" },
                                ].map(({ icon: Icon, label }) => (
                                    <th
                                        key={label}
                                        className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-400 bg-slate-50/50"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <Icon className="h-3.5 w-3.5" />
                                            {label}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.length > 0 ? (
                                paginated.map((log: TBorrowingLogs) => (
                                    <tr
                                        key={log.id}
                                        onClick={() => handleRowClick(log)}
                                        className="group transition-all duration-200 hover:bg-blue-50/30 cursor-pointer"
                                    >
                                        {/* Borrower */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`h-10 w-10 rounded-full bg-gradient-to-tr ${getAvatarGradient(log.borrowerName)} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
                                                >
                                                    {getInitials(log.borrowerName)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[140px]">
                                                        {log.borrowerName ?? "—"}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                        {getRoleBadge(log.borrowerRole)}
                                                        {log.studentIdNumber && (
                                                            <span className="text-xs text-slate-400 font-mono">
                                                                #{log.studentIdNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Item */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-900 truncate max-w-[160px]">
                                                {log.itemName}
                                            </p>
                                            {log.reservedFor && (
                                                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
                                                    Reserved for: {log.reservedFor}
                                                </p>
                                            )}
                                        </td>

                                        {/* Serial No. */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                                                {log.itemSerialNumber}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {log.previousStatus && (
                                                    <>
                                                        <span className="text-xs text-slate-400 font-medium">
                                                            {log.previousStatus}
                                                        </span>
                                                        <div className="flex items-center justify-center h-4 w-4 rounded-full bg-slate-100">
                                                            <ArrowRight className="h-2.5 w-2.5 text-slate-400" />
                                                        </div>
                                                    </>
                                                )}
                                                {getStatusBadge(log.currentStatus)}
                                            </div>
                                        </td>

                                        {/* Borrowed At */}
                                        <td className="px-6 py-4">
                                            {log.borrowedAt ? (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-slate-700 text-xs">
                                                        {formatDate(log.borrowedAt)}
                                                    </span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatTime(log.borrowedAt)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 text-xs italic">—</span>
                                            )}
                                        </td>

                                        {/* Returned At */}
                                        <td className="px-6 py-4">
                                            {log.returnedAt ? (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-emerald-700 text-xs">
                                                        {formatDate(log.returnedAt)}
                                                    </span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatTime(log.returnedAt)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-xs font-medium border border-amber-100">
                                                    Not returned
                                                </span>
                                            )}
                                        </td>

                                        {/* Remarks */}
                                        <td className="px-6 py-4 max-w-[180px]">
                                            {log.remarks ? (
                                                <p className="text-xs text-slate-500 truncate" title={log.remarks}>
                                                    {log.remarks}
                                                </p>
                                            ) : (
                                                <span className="text-slate-300 text-xs italic">No remarks</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20">
                                        <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                                                <Search className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">No logs found</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                No borrow logs match your current search or filter. Try adjusting your criteria.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500 font-medium">
                        Showing{" "}
                        <span className="font-bold text-slate-900">
                            {filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}–
                            {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-900">{filtered.length}</span>{" "}
                        entries
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                                (p) =>
                                    p === 1 ||
                                    p === totalPages ||
                                    Math.abs(p - safePage) <= 1
                            )
                            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p as number)}
                                        className={`min-w-[36px] h-9 rounded-xl text-xs font-semibold transition-all ${
                                            safePage === p
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <BorrowLogsDetailModal
                    log={selectedLog}
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
