import { FaPlus } from "react-icons/fa6";

type ButtonProps = {
  onClick?: () => void;
  name?: string;
};

export default function Button({ onClick, name }: ButtonProps) {
  return (
    <button
      className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-100 hover:shadow-sm transition-all duration-150"
      type="button"
      onClick={onClick}
      data-testid="button"
    >
      <FaPlus className="font-bold text-lg" /> {name}
    </button>
  );
}
