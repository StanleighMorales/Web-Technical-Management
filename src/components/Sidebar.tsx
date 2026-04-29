import { Link, useNavigate } from "@tanstack/react-router";
import logo from "../assets/newAclcLogo.webp";
import { CiLogout, CiUser } from "react-icons/ci";
import { GiArchiveRegister } from "react-icons/gi";
import {
  MdHistory,
  MdInventory,
  MdDashboardCustomize,
} from "react-icons/md";
import { BiLogoSass } from "react-icons/bi";
import { BsPersonCircle, BsClipboardCheck } from "react-icons/bs";
import { TbPackages } from "react-icons/tb";
import { FaWifi } from "react-icons/fa";
import { useState, useEffect } from "react";
import SidebarSkeletonLoader from "../loader/SidebarSkeletonLoader";
import { useSidebar } from "../context/SidebarContext";
import { usePendingCount } from "../hooks/usePendingCount";
import { useActiveBorrowCount } from "../hooks/useActiveBorrowCount";
import { useLogoutUser } from "../hooks/authHooks";
import type { IconType } from "react-icons";

type NavLink = {
  label: string;
  link: string;
  icon: IconType;
  badge?: number;
};

export default function Sidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { mutate, isPending } = useLogoutUser();
  const { setIsSidebarExpanded } = useSidebar();
  const { total: pendingCount } = usePendingCount();
  const activeBorrowCount = useActiveBorrowCount();

  const primaryLinks: NavLink[] = [
    { label: "Dashboard", link: "/home/dashboard", icon: MdDashboardCustomize },
    { label: "Inventory", link: "/home/inventory-list", icon: GiArchiveRegister },
    {
      label: "Pending Requests",
      link: "/home/pending-reservations",
      icon: BsClipboardCheck,
      badge: pendingCount,
    },
  ];

  const operationalLinks: NavLink[] = [
    { label: "Borrowing", link: "/home/borrow-item", icon: TbPackages },
    { label: "Active Borrows", link: "/home/active-borrowed-items", icon: BsClipboardCheck, badge: activeBorrowCount },
    { label: "Scan Controller", link: "/home/rfid-controller", icon: FaWifi },
  ];

  const administrativeLinks: NavLink[] = [
    { label: "User Management", link: "/home/user-management", icon: CiUser },
    { label: "Activity Logs", link: "/home/activity-logs", icon: BiLogoSass },
    { label: "Borrowing Logs", link: "/home/borrow-logs", icon: MdHistory },
    { label: "Archives", link: "/home/archive-table", icon: MdInventory },
  ];

  const bottomLinks: NavLink[] = [
    { label: "Profile", link: "/home/settings", icon: BsPersonCircle },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSidebarLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const logoutUser = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      mutate(undefined, {
        onSuccess: () => navigate({ to: "/" }),
        onError: (err) => {
          console.error(err.message);
          setIsLoggingOut(false);
        },
      });
    }, 2200);
  };

  if (isSidebarLoading) return <SidebarSkeletonLoader />;

  const navLinkBase =
    "flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium text-[13px] tracking-wide text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all duration-200";
  const navLinkActive =
    "active !bg-blue-600 !text-white shadow-sm shadow-blue-600/30";
  const iconWrap =
    "flex items-center justify-center w-8 h-8 rounded-md shrink-0 bg-slate-100 group-hover:bg-blue-50 [.active_&]:!bg-white/20";

  const SectionLabel = ({ label }: { label: string }) => (
    <li className="px-2.5 pt-4 pb-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">
        {label}
      </span>
    </li>
  );

  const NavItem = ({
    item,
    badgeColor = "orange",
    onClick,
    alwaysShowLabel = false,
  }: {
    item: NavLink;
    badgeColor?: "orange" | "green";
    onClick?: () => void;
    alwaysShowLabel?: boolean;
  }) => {
    const bgBadge = badgeColor === "green" ? "bg-emerald-500 shadow-emerald-500/30" : "bg-orange-500 shadow-orange-500/30";
    return (
      <li>
        <Link
          to={item.link}
          onClick={onClick}
          className={`${navLinkBase} group`}
          activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
        >
          <span className={`${iconWrap} relative`}>
            <item.icon className="text-[17px] text-slate-500 group-hover:text-blue-600 [.active_&]:!text-white" />
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold text-white ${bgBadge} rounded-full ring-2 ring-slate-50 shadow-md ${alwaysShowLabel ? "" : "lg:group-hover:hidden"}`}>
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </span>
          <span className={`whitespace-nowrap flex-1 ${alwaysShowLabel ? "" : "opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100"}`}>
            {item.label}
          </span>
          {item.badge !== undefined && item.badge > 0 && !alwaysShowLabel && (
            <span className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold text-white ${bgBadge} rounded-full hidden lg:group-hover:inline-flex shadow-sm`}>
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
          {item.badge !== undefined && item.badge > 0 && alwaysShowLabel && (
            <span className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold text-white ${bgBadge} rounded-full shadow-sm`}>
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden fixed top-0 left-0 z-50 flex-col justify-between h-screen bg-white border-r border-slate-200 shadow-sm transition-all duration-300 lg:flex group animate-fadeIn w-[68px] hover:w-[260px]"
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* Logo */}
        <div className="flex flex-col items-center pt-5 pb-3 px-2 border-b border-slate-100">
          <div className="rounded-full p-1 bg-slate-50 ring-1 ring-slate-200 transition-all duration-300 group-hover:scale-105">
            <img
              src={logo}
              alt="Logo"
              className="rounded-full w-10 h-10 transition-all duration-300 group-hover:w-16 group-hover:h-16"
            />
          </div>
          <span className="mt-1.5 text-sm font-bold tracking-widest opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-blue-600 uppercase">
            ACLC
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 group-hover:scrollbar-thin scrollbar-none">
          <ul className="flex flex-col gap-0.5">
            <SectionLabel label="Main" />
            {primaryLinks.map((item) => (
              <NavItem key={item.label} item={item} badgeColor="orange" />
            ))}

            <SectionLabel label="Operations" />
            {operationalLinks.map((item) => (
              <NavItem key={item.label} item={item} badgeColor="green" />
            ))}

            {/* Divider */}
            <li className="my-1.5 px-2">
              <div className="h-px bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </li>

            <SectionLabel label="Administration" />
            {administrativeLinks.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}

            <SectionLabel label="Account" />
            {bottomLinks.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <footer className="p-2 border-t border-slate-100">
          <button
            type="button"
            onClick={logoutUser}
            disabled={isPending}
            className="flex gap-2.5 items-center py-2 px-2.5 w-full rounded-lg text-[13px] font-medium tracking-wide text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 disabled:opacity-50"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 bg-red-50">
              <CiLogout className="text-[17px] text-red-500" />
            </span>
            <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Sign Out
            </span>
          </button>
        </footer>
      </aside>

      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all duration-200"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/*  Mobile Overlay  */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/40 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/*  Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="flex fixed inset-y-0 left-0 z-50 flex-col w-68 max-w-[85vw] bg-white border-r border-slate-200 shadow-xl lg:hidden animate-slideIn overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full ring-1 ring-slate-200" />
            <div>
              <p className="text-sm font-bold text-slate-900 tracking-wide">ACLC</p>
              <p className="text-[11px] text-slate-400 font-medium">College of Mandaue</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-2">
            <ul className="flex flex-col gap-0.5">
              {/* Section: Main */}
              <li className="px-2.5 pt-2 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Main</span>
              </li>
              {primaryLinks.map((item) => (
                <NavItem key={item.label} item={item} badgeColor="orange" onClick={closeMobileMenu} alwaysShowLabel />
              ))}

              {/* Section: Operations */}
              <li className="px-2.5 pt-3 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Operations</span>
              </li>
              {operationalLinks.map((item) => (
                <NavItem key={item.label} item={item} badgeColor="green" onClick={closeMobileMenu} alwaysShowLabel />
              ))}

              {/* Divider */}
              <li className="my-1.5 px-2">
                <div className="h-px bg-slate-100" />
              </li>

              {/* Section: Administration */}
              <li className="px-2.5 pt-1 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Administration</span>
              </li>
              {administrativeLinks.map((item) => (
                <NavItem key={item.label} item={item} onClick={closeMobileMenu} alwaysShowLabel />
              ))}

              {/* Section: Account */}
              <li className="px-2.5 pt-3 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</span>
              </li>
              {bottomLinks.map((item) => (
                <NavItem key={item.label} item={item} onClick={closeMobileMenu} alwaysShowLabel />
              ))}
            </ul>
          </nav>

          <footer className="p-2 border-t border-slate-100">
            <button
              type="button"
              onClick={logoutUser}
              disabled={isPending}
              className="flex gap-2.5 items-center py-2 px-2.5 w-full rounded-lg text-[13px] font-medium tracking-wide text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50">
                <CiLogout className="text-[17px] text-red-500" />
              </span>
              Sign Out
            </button>
          </footer>
        </div>
      )}

      {/*  Logout overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-6 text-center px-8">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Signed out successfully
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                Thank you for using the system.
              </p>
            </div>
            <div className="flex gap-1.5 mt-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
