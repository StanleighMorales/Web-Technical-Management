type TFloatingActionButtons = {
  showFloatingMenu: boolean;
  setShowFloatingMenu: (value: boolean) => void;
  menuOpenedByClick: boolean;
  setShowScanModal: (value: boolean) => void;
  setMenuOpenedByClick: (value: boolean) => void;
  setShowReturnModal: (value: boolean) => void;
};

export const FloatingActionButtons = ({
  showFloatingMenu,
  setShowFloatingMenu,
  menuOpenedByClick,
  setShowScanModal,
  setMenuOpenedByClick,
  setShowReturnModal,
}: TFloatingActionButtons) => {
  return (
    <div
      className="fixed right-0 bottom-12 z-40"
      onMouseEnter={() => setShowFloatingMenu(true)}
      onMouseLeave={() => {
        if (!menuOpenedByClick) {
          setShowFloatingMenu(false);
        }
      }}
    >
      <div className="flex flex-col items-end gap-3">
        {/* Scan Button - Slides from right */}
        <button
          onClick={() => {
            setShowScanModal(true);
            setShowFloatingMenu(false);
            setMenuOpenedByClick(false);
          }}
          className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 overflow-hidden ${showFloatingMenu
              ? "translate-x-0 opacity-100 pointer-events-auto delay-75 pr-4 pl-3"
              : "translate-x-full opacity-0 pointer-events-none pr-0 pl-3"
            }`}
          style={{
            borderRadius: "9999px 0 0 9999px",
          }}
          title="Scan Lent Item"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
          <span
            className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${showFloatingMenu ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
              }`}
          >
            Scan Lent Item
          </span>
        </button>

        {/* Return Button - Slides from right */}
        <button
          onClick={() => {
            setShowReturnModal(true);
            setShowFloatingMenu(false);
            setMenuOpenedByClick(false);
          }}
          className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 overflow-hidden ${showFloatingMenu
              ? "translate-x-0 opacity-100 pointer-events-auto delay-150 pr-4 pl-3"
              : "translate-x-full opacity-0 pointer-events-none pr-0 pl-3"
            }`}
          style={{
            borderRadius: "9999px 0 0 9999px",
          }}
          title="Return Item"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span
            className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${showFloatingMenu ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
              }`}
          >
            Return Item
          </span>
        </button>

        {/* Main Plus Button - Reverse D Shape */}
        <div className="relative">
          <button
            onClick={() => {
              if (showFloatingMenu && menuOpenedByClick) {
                setShowFloatingMenu(false);
                setMenuOpenedByClick(false);
              } else {
                setShowFloatingMenu(true);
                setMenuOpenedByClick(true);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-5"
            style={{
              borderRadius: "50% 0 0 50%",
            }}
            title="Quick Actions"
          >
            <svg
              className={`w-7 h-7 md:w-8 md:h-8 transition-transform duration-300 ${showFloatingMenu ? "rotate-45" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
