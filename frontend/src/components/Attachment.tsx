import { LuSquareArrowOutUpRight } from "react-icons/lu";

type AttachmentProps = {
  link: {
    url: string;
  };
  index: number;
};

function Attachment({ link, index }: AttachmentProps) {
  // Handle attachment link click
  const handleLinkClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="flex justify-between bg-gray-50 dark:bg-dark border border-gray-100 dark:border-gray-400 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={() => handleLinkClick(link.url)}
    >
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-xs text-black dark:text-white truncate max-w-[180px]">
          {link.url.split("/").pop()}
        </p>
      </div>
      <LuSquareArrowOutUpRight className="text-gray-400 dark:text-blue-300" />
    </div>
  );
}

export default Attachment;
