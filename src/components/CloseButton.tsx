import { FaTimes } from "react-icons/fa";

interface CloseButtonProps {
    onClick: () => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
    return (
        <button
            data-testid="closebutton"
            onClick={onClick}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
        >
            <FaTimes className="text-xl" />
        </button>
    )
}
