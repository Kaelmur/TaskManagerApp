import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

interface Option {
  value: string | number;
  label: string;
}

interface SelectDropdownProps {
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
}

function SelectDropdown({
  options,
  value,
  onChange,
  placeholder,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-black dark:text-white outline-none bg-white dark:bg-black border border-slate-100 dark:border-gray-800 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="ml-2">
          {isOpen ? (
            <LuChevronDown className="rotate-100" />
          ) : (
            <LuChevronDown />
          )}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-white dark:bg-black border border-slate-100 dark:border-gray-800 rounded-md mt-1 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectDropdown;
