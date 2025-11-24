import { FaSearch } from "react-icons/fa";

type SearchProps = {
  onChangeValue: (value: string) => void;
  name?: string;
  placeholder?: string;
};

const SearchBar = ({ onChangeValue, name, placeholder }: SearchProps) => {
  return (
    <div className="flex items-center py-2 px-4 w-full max-w-md rounded-md shadow-inner bg-[#f1f5f9]">
      <FaSearch className="mr-3 text-xl text-[#64748b]" />
      <input
        className="p-1 w-full text-lg bg-transparent border-none outline-none text-[#222] placeholder-[#94a3b8]"
        type="search"
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
