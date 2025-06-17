import { ReactElement } from "react";
import { addThousandsSeparator } from "../../utils/helper";

function InfoCard({
  label,
  value,
  color,
}: {
  icon: ReactElement;
  label: string;
  value: number;
  color: string;
}) {
  const formattedValue = addThousandsSeparator(value);

  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />

      <p className="text-xs md:text-[14px] text-gray-500 dark:text-gray-400">
        <span className="text-sm md:text-[15px] text-black dark:text-white font-semibold">
          {formattedValue}
        </span>{" "}
        {label}
      </p>
    </div>
  );
}

export default InfoCard;
