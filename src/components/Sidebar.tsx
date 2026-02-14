import { Link, useNavigate } from "@tanstack/react-router";
import logo from "../assets/aclcLogo.webp";
import { CiLogout, CiUser } from "react-icons/ci";
import { GiArchiveRegister } from "react-icons/gi";
import { GrStorage } from "react-icons/gr";
import {
  MdHistory,
  MdInventory,
  MdDashboardCustomize,
  MdAppRegistration,
} from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { BsPersonCircle, BsClipboardCheck } from "react-icons/bs";
import { useState, useEffect } from "react";
import SidebarSkeletonLoader from "../loader/SidebarSkeletonLoader";
import { useSidebar } from "../context/SidebarContext";
import { usePendingCount } from "../hooks/usePendingCount";
import { useLogoutUser } from "../hooks/authHooks";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState<boolean>(true);
  const [isItemsDropdownOpen, setIsItemsDropdownOpen] = useState<boolean>(false);
  const [wasItemsDropdownOpen, setWasItemsDropdownOpen] = useState<boolean>(false);

  const { mutate, isPending } = useLogoutUser();
  const { setIsSidebarExpanded } = useSidebar();
  const { total: pendingCount } = usePendingCount();

  const sideBarListTop = [
    { label: "Dashboard", link: "/home/dashboard", icon: MdDashboardCustomize },
    { label: "Inventory List", link: "/home/inventory-list", icon: GiArchiveRegister },
    { label: "User Management", link: "/home/user-management", icon: CiUser },
  ];

  const sideBarListBottom = [
    { label: "Archives", link: "/home/archive-table", icon: MdInventory },
    { label: "Borrow History", link: "/home/history-list", icon: MdHistory },
    { label: "Registered Module", link: "/home/registration-module", icon: MdAppRegistration },
    { label: "Profile", link: "/home/settings", icon: BsPersonCircle },
  ];

  const itemsSubmenu = [
    { label: "Borrow Items", link: "/home/borrow-item", icon: GrStorage },
    { label: "Pending & Reservations", link: "/home/pending-reservations", icon: BsClipboardCheck },
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
      onSuccess: () => navigate({ to: "/" }), // <--- Fixed for TanStack Router
      onError: (err) => console.error(err.message),
    });
  };

  if (isSidebarLoading) return <SidebarSkeletonLoader />;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden fixed top-0 left-0 z-50 flex-col justify-between h-screen bg-white border-r shadow-xl transition-all duration-300 lg:flex group animate-fadeIn w-[75px] border-[#e5e7eb] hover:w-[270px] scrollbar-thin"
        onMouseEnter={() => {
          setIsSidebarExpanded(true);
          setIsItemsDropdownOpen(wasItemsDropdownOpen);
        }}
        onMouseLeave={() => {
          setIsSidebarExpanded(false);
          setWasItemsDropdownOpen(isItemsDropdownOpen);
          setIsItemsDropdownOpen(false);
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center py-8">
          <img
            src={logo}
            alt="Logo"
            className="mb-2 rounded-full w-12 h-12 transition-all duration-300 group-hover:w-20 group-hover:h-20"
          />
          <span className="text-xl font-extrabold tracking-widest opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-[#2563eb]">
            ACLC
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin">
          <ul className="flex flex-col gap-2 px-2">
            {sideBarListTop.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.link}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-lg font-medium text-base text-gray-500 hover:bg-[#f1f5f9] hover:text-[#2563eb] transition-all duration-150"
                  activeProps={{ className: "bg-blue-600 text-white shadow" }}
                >
                  <item.icon className="text-2xl min-w-[30px]" />
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}

            {/* Manage Borrow Items Dropdown */}
            <li>
              <button
                onClick={() => setIsItemsDropdownOpen(!isItemsDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-lg font-medium text-base w-full text-gray-500 hover:bg-[#f1f5f9] hover:text-[#2563eb] relative transition-all duration-150"
              >
                <BiPackage className="text-2xl min-w-[30px]" />
                {pendingCount > 0 && (
                  <span className="absolute left-8 top-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
                <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex-1 text-left">
                  Manage Borrow Items
                </span>
                {isItemsDropdownOpen ? <FaChevronDown /> : <FaChevronRight />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isItemsDropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="flex flex-col gap-1 mt-1 ml-4">
                  {itemsSubmenu.map((subItem) => (
                    <li key={subItem.label}>
                      <Link
                        to={subItem.link}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-sm text-gray-500 hover:bg-[#f1f5f9] hover:text-[#2563eb] transition-all duration-150"
                        activeProps={{ className: "bg-blue-600 text-white shadow" }}
                      >
                        <subItem.icon className="text-xl min-w-[24px]" />
                        <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex-1">
                          {subItem.label}
                        </span>
                        {subItem.link === "pending-reservations" && pendingCount > 0 && (
                          <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-orange-500 rounded-full">
                            {pendingCount > 99 ? "99+" : pendingCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {sideBarListBottom.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.link}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-lg font-medium text-base text-gray-500 hover:bg-[#f1f5f9] hover:text-[#2563eb] transition-all duration-150"
                  activeProps={{ className: "bg-blue-600 text-white shadow" }}
                >
                  <item.icon className="text-2xl min-w-[30px]" />
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <footer className="py-2 px-2 border-t border-gray-200">
          <button
            type="button"
            onClick={logoutUser}
            className="flex gap-3 items-center py-3 px-3 w-full text-base font-medium rounded-lg text-[#ef4444] hover:bg-[#fee2e2] hover:text-[#b91c1c] transition-all duration-150"
            disabled={isPending}
          >
            <CiLogout className="text-2xl shrink-0 min-w-6" />
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
          className="p-3 rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-black"
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
          className="fixed inset-0 z-40 lg:hidden bg-black/70 backdrop-blur-md"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="flex fixed inset-y-0 left-0 z-50 flex-col w-64 bg-white shadow-lg lg:hidden animate-slideIn">
          {/* Keep all your mobile sidebar code, just replace NavLink → Link and add activeProps */}
        </div>
      )}
    </>
  );
}
