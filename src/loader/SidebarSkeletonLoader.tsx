export default function SidebarSkeletonLoader() {
  return (
    <aside className="hidden top-0 left-0 z-30 flex-col justify-between h-screen bg-white border-r shadow-xl lg:flex animate-fadeIn w-[75px] border-[#e5e7eb]">
      {/* Logo and Title Skeleton */}
      <div className="flex flex-col items-center py-8">
        {/* Logo skeleton */}
        <div className="mb-2 w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
        {/* Title skeleton */}
      </div>

      {/* Navigation Skeleton */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-2 px-4">
          {/* Navigation items skeleton */}
          {[...Array(6)].map((_, index) => (
            <li key={index}>
              <div className="flex gap-3 items-center py-3 rounded-lg px-auto">
                <div className="h-4 bg-gray-200 rounded animate-pulse min-w-[30px]"></div>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button Skeleton */}
      <footer className="py-8 px-4">
        <div className="flex gap-2 justify-center items-center py-3 px-4 w-full rounded-lg shadow bg-[#f1f5f9]">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </footer>
    </aside>
  );
}
