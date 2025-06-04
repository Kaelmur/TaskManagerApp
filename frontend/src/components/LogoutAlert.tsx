interface LogoutAlertProps {
  content: string;
  onLogout: () => void;
}

function LogoutAlert({ content, onLogout }: LogoutAlertProps) {
  return (
    <div>
      <p className="text-sm dark:text-white">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-100 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer"
          onClick={onLogout}
        >
          Выйти
        </button>
      </div>
    </div>
  );
}

export default LogoutAlert;
