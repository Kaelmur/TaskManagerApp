import { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

export type TodoChecklistItem = {
  text: string;
  completed: boolean;
};

type TodoListInputProps = {
  todoList: TodoChecklistItem[];
  setTodoList: (value: TodoChecklistItem[]) => void;
};

function TodoListInput({ todoList, setTodoList }: TodoListInputProps) {
  const [option, setOption] = useState("");

  //   Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      const newItem: TodoChecklistItem = {
        text: option.trim(),
        completed: false,
      };
      setTodoList([...todoList, newItem]);
      setOption("");
    }
  };

  //   Function to handle deleting an option
  const handleDeleteOption = (index: number) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={index}
          className="flex justify-between bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-black dark:text-white">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item.text}
          </p>

          <button
            className="cursor-pointer"
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="text-lg text-red-500 dark:text-red-400" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Введите задачу"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-[13px] text-black dark:text-white outline-none bg-white dark:bg-black border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" />
          Добавить
        </button>
      </div>
    </div>
  );
}

export default TodoListInput;
