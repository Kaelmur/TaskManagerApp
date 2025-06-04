interface DeleteAlertProps {
  content: string;
  onDelete: () => void;
}

function DeleteAlert({ content, onDelete }: DeleteAlertProps) {
  return (
    <div>
      <p className="text-sm dark:text-white">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-100 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer"
          onClick={onDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

export default DeleteAlert;
