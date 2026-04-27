import { Link, useNavigate } from "@tanstack/react-router";
import logo from "../assets/aclcLogo.webp";
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
import { useState, useEffect } from "react";
import SidebarSkeletonLoader from "../loader/SidebarSkeletonLoader";
import { useSidebar } from "../context/SidebarContext";
import { usePendingCount } from "../hooks/usePendingCount";
import { useLogoutUser } from "../hooks/authHooks";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState<boolean>(true);

  const { mutate, isPending } = useLogoutUser();
  const { setIsSidebarExpanded } = useSidebar();
  const { total: pendingCount } = usePendingCount();

  // Primary navigation links
  const primaryLinks = [
    { label: "Dashboard", link: "/home/dashboard", icon: MdDashboardCustomize },
    { label: "Inventory", link: "/home/inventory-list", icon: GiArchiveRegister },
    { 
      label: "Pending Requests", 
      link: "/home/pending-reservations", 
      icon: BsClipboardCheck,
      badge: pendingCount 
    },
  ];

  // Operational links (with divider after)
  const operationalLinks = [
    { label: "Borrowing", link: "/home/borrow-item", icon: TbPackages },
    { label: "Active Borrows", link: "/home/active-borrowed-items", icon: BsClipboardCheck },
  ];

  // Administrative links
  const administrativeLinks = [
    { label: "User Management", link: "/home/user-management", icon: CiUser },
    { label: "Activity Logs", link: "/home/activity-logs", icon: BiLogoSass },
    { label: "Borrowing Logs", link: "/home/borrow-logs", icon: MdHistory },
    { label: "Archives", link: "/home/archive-table", icon: MdInventory },
  ];

  // Bottom links
  const bottomLinks = [
    { label: "Profile", link: "/home/settings", icon: BsPersonCircle },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSidebarLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const logoutUser = () => {
    mutate(undefined, {
      onSuccess: () => navigate({ to: "/" }),
      onError: (err) => console.error(err.message),
    });
  };

  if (isSidebarLoading) return <SidebarSkeletonLoader />;

  const navLinkBase =
    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[15px] text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all duration-200";
  const navLinkActive = "active !bg-blue-600 !text-white shadow-md shadow-blue-600/25";
  const iconWrap =
    "flex items-center justify-center w-9 h-9 rounded-lg shrink-0 bg-slate-100 group-hover:bg-blue-50 [.active_&]:!bg-white/20";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden fixed top-0 left-0 z-50 flex-col justify-between h-screen bg-slate-50/95 border-r border-slate-200/80 shadow-lg transition-all duration-300 lg:flex group animate-fadeIn w-[80px] hover:w-[280px] backdrop-blur-sm"
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* Logo */}
        <div className="flex flex-col items-center pt-6 pb-4 px-2">
          <div className="rounded-2xl p-1.5 bg-white shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 group-hover:scale-105">
            <img
              src={logo}
              alt="Logo"
              className="rounded-xl w-11 h-11 transition-all duration-300 group-hover:w-14 group-hover:h-14"
            />
          </div>
          <span className="mt-2 text-lg font-bold tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-blue-600">
            ACLC
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 group-hover:scrollbar-thin scrollbar-none">
          <ul className="flex flex-col gap-1">
            {/* Primary Links */}
            {primaryLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.link}
                  className={`${navLinkBase} group`}
                  activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                >
                  <span className={iconWrap + " relative"}>
                    <item.icon className="text-xl text-slate-500 group-hover:text-blue-600 [.active_&]:!text-white" />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-orange-500 rounded-full ring-2 ring-slate-50 animate-pulse lg:group-hover:hidden transition-opacity">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </span>
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100 flex-1">
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-orange-500 rounded-full hidden lg:group-hover:inline-flex transition-opacity">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}

            {/* Operational Links */}
            {operationalLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.link}
                  className={`${navLinkBase} group`}
                  activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                >
                  <span className={iconWrap}>
                    <item.icon className="text-xl text-slate-500 group-hover:text-blue-600 [.active_&]:!text-white" />
                  </span>
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}

            {/* Divider */}
            <li className="my-2 px-3">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </li>

            {/* Administrative Links */}
            {administrativeLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.link}
                  className={`${navLinkBase} group`}
                  activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                >
                  <span className={iconWrap}>
                    <item.icon className="text-xl text-slate-500 group-hover:text-blue-600 [.active_&]:!text-white" />
                  </span>
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}

            {/* Bottom Links */}
            {bottomLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.link}
                  className={`${navLinkBase} group`}
                  activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                >
                  <span className={iconWrap}>
                    <item.icon className="text-xl text-slate-500 group-hover:text-blue-600 [.active_&]:!text-white" />
                  </span>
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <footer className="p-2 border-t border-slate-200/80">
          <button
            type="button"
            onClick={logoutUser}
            className="flex gap-3 items-center py-2.5 px-3 w-full rounded-xl text-[15px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 disabled:opacity-60"
            disabled={isPending}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 bg-red-50">
              <CiLogout className="text-xl text-red-500" />
            </span>
            <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Logout
            </span>
          </button>
        </footer>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-lg hover:bg-slate-50 transition-all duration-200"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="flex fixed inset-y-0 left-0 z-50 flex-col w-72 max-w-[85vw] bg-slate-50 border-r border-slate-200 shadow-2xl lg:hidden animate-slideIn overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 bg-white/80">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-xl shadow-sm" />
            <span className="text-xl font-bold tracking-wide text-blue-600">ACLC</span>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="flex flex-col gap-1">
              {/* Primary Links */}
              {primaryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.link}
                    onClick={closeMobileMenu}
                    className={`${navLinkBase} group`}
                    activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                  >
                    <span className={iconWrap + " relative"}>
                      <item.icon className="text-xl text-slate-500 [.active_&]:!text-white" />
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-orange-500 rounded-full">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-orange-500 rounded-full">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}

              {/* Operational Links */}
              {operationalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.link}
                    onClick={closeMobileMenu}
                    className={`${navLinkBase} group`}
                    activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                  >
                    <span className={iconWrap}>
                      <item.icon className="text-xl text-slate-500 [.active_&]:!text-white" />
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Divider */}
              <li className="my-2 px-3">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              </li>

              {/* Administrative Links */}
              {administrativeLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.link}
                    onClick={closeMobileMenu}
                    className={`${navLinkBase} group`}
                    activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                  >
                    <span className={iconWrap}>
                      <item.icon className="text-xl text-slate-500 [.active_&]:!text-white" />
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Bottom Links */}
              {bottomLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.link}
                    onClick={closeMobileMenu}
                    className={`${navLinkBase} group`}
                    activeProps={{ className: `${navLinkBase} ${navLinkActive} group` }}
                  >
                    <span className={iconWrap}>
                      <item.icon className="text-xl text-slate-500 [.active_&]:!text-white" />
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <footer className="p-3 border-t border-slate-200 bg-white/50">
            <button
              type="button"
              onClick={logoutUser}
              className="flex gap-3 items-center py-2.5 px-3 w-full rounded-xl text-[15px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              disabled={isPending}
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50">
                <CiLogout className="text-xl text-red-500" />
              </span>
              Logout
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
