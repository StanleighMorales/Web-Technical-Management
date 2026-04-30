const Bone = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className ?? ""}`} />
);

export default function SidebarSkeletonLoader() {
  return (
    <aside className="hidden fixed top-0 left-0 z-50 flex-col justify-between h-screen bg-white border-r border-slate-200 shadow-sm lg:flex animate-fadeIn w-[68px]">

      {/* Logo */}
      <div className="flex flex-col items-center pt-5 pb-3 px-2 border-b border-slate-100 gap-2">
        <Bone className="w-10 h-10 rounded-full" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2">
        <ul className="flex flex-col gap-0.5">
          {/* Section label placeholder */}
          <li className="px-2.5 pt-4 pb-1">
            <Bone className="h-2 w-6 rounded-sm" />
          </li>

          {/* Primary group — 3 items */}
          {[...Array(3)].map((_, i) => (
            <li key={`p-${i}`}>
              <div className="flex items-center gap-2.5 px-2.5 py-2">
                <Bone className="w-8 h-8 rounded-md shrink-0" />
              </div>
            </li>
          ))}

          {/* Section label placeholder */}
          <li className="px-2.5 pt-4 pb-1">
            <Bone className="h-2 w-8 rounded-sm" />
          </li>

          {/* Operational group — 3 items */}
          {[...Array(3)].map((_, i) => (
            <li key={`o-${i}`}>
              <div className="flex items-center gap-2.5 px-2.5 py-2">
                <Bone className="w-8 h-8 rounded-md shrink-0" />
              </div>
            </li>
          ))}

          {/* Divider */}
          <li className="my-1.5 px-2">
            <div className="h-px bg-slate-100" />
          </li>

          {/* Section label placeholder */}
          <li className="px-2.5 pt-1 pb-1">
            <Bone className="h-2 w-10 rounded-sm" />
          </li>

          {/* Administrative group — 4 items */}
          {[...Array(4)].map((_, i) => (
            <li key={`a-${i}`}>
              <div className="flex items-center gap-2.5 px-2.5 py-2">
                <Bone className="w-8 h-8 rounded-md shrink-0" />
              </div>
            </li>
          ))}

          {/* Section label placeholder */}
          <li className="px-2.5 pt-4 pb-1">
            <Bone className="h-2 w-6 rounded-sm" />
          </li>

          {/* Account — 1 item */}
          <li>
            <div className="flex items-center gap-2.5 px-2.5 py-2">
              <Bone className="w-8 h-8 rounded-md shrink-0" />
            </div>
          </li>
        </ul>
      </nav>

      {/* Sign out */}
      <footer className="p-2 border-t border-slate-100">
        <div className="flex items-center gap-2.5 py-2 px-2.5">
          <Bone className="w-8 h-8 rounded-md shrink-0" />
        </div>
      </footer>
    </aside>
  );
}
