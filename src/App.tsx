import { Fragment, useEffect, useState } from "react";
import "./App.css";
import getTodoContract from "./utils/todoContract";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { AiFillDelete } from "react-icons/ai";
import {
  MdEdit,
} from "react-icons/md";
import { CgToggleOff, CgToggleOn } from "react-icons/cg";
import DotLoader from "react-spinners/DotLoader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Contract = any;

// CONTRACT ADDRESS: 0x057c50505c000805e2F7dcAD0E5deabC2Fd977Cc
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [indexOfTodo, setIndexOfTodo] = useState<number | null>(null);
  const [time, setTime] = useState<string>("");
  const [updateTitle, setUpdateTitle] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("");
  const [todos, setTodos] = useState<Array<any>>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // @ts-ignore
  const { ethereum } = window;
  const { isConnected, address } = useAccount();

  const getTodos = async () => {
    if (ethereum) {
      setLoading(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);
        const todo = await todoContract.getTask();
        setTodos(todo);
        setLoading(false);
      } catch(error: any) {
        toast.dismiss();
        toast.error(error.message, {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const createTodo = async (e: any) => {
    e.preventDefault();

    if (!isConnected) {
      toast.dismiss();
      toast.info("Make sure you connect to metaMask!", {
        position: "top-right",
        pauseOnHover: true,
        draggable: false,
      });
      return;
    }

    const parsedTime = Date.parse(time);

    if (ethereum) {
      setIsLoading(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);

        const todo = await todoContract.setTask(title, parsedTime);

        await todo.wait();

        getTodos();

        toast.dismiss();
        toast.success("Created a task successfully!", {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });

        setIsLoading(false);
      } catch(error: any) {
        toast.dismiss();
        toast.error(error.message, {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const editTodo = async (e: any) => {
    e.preventDefault();

    if (!isConnected) {
      alert("You need to connect!");
      return;
    }

    if (ethereum) {
      setIsEditing(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);

        // (uint256 _taskIndex, string calldata _task)

        const todo = await todoContract.updateTask(indexOfTodo, updateTitle);

        await todo.wait();

        getTodos();
        setIsEditing(false);

        toast.dismiss();
        toast.success("Edited a task successfully!", {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });

        setUpdateTime("");
        setUpdateTitle("");
        setIndexOfTodo(null);
      } catch(error: any) {
        toast.dismiss();
        toast.error(error.message, {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
      } finally {
        setIsEditing(false);
      }
    }
  };

  const updateTodo = async (todo: any, index: number) => {
    setUpdateTime(todo.deadline);
    setUpdateTitle(todo.task);
    setIndexOfTodo(index);
    setIsEdit(true);
  };

  const completeTodo = async (index: number) => {
    alert(index);
    if (ethereum) {
      setIsCompleting(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);

        const todo = await todoContract.completeTask(index);
        await todo.wait();

        getTodos();

        toast.dismiss();
        toast.success("Toggled a task successfully!", {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });

        setIsCompleting(false);
      } catch(error: any) {
        toast.dismiss();
        toast.error(error.message, {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
      } finally {
        setIsCompleting(false);
      }
    }
  };

  const deleteTodo = async (index: number) => {
    if (ethereum) {
      setIsDeleting(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);

        const todo = await todoContract.deleteTask(index);

        await todo.wait();

        getTodos();

        toast.dismiss();
        toast.success("Deleted a task successfully!", {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });

        setIsDeleting(false);
      } catch(error: any) {
        toast.dismiss();
        toast.error(error.message, {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="grid place-items-center mt-12 ">
      <div className="w-11/12 sm:w-3/4 md:w-2/3 p-2">
        <div className="text-center">
          <h1 className="text-3xl font-medium">TASK MANAGER</h1>
          <p className="text-lg">
            Your daily task manager that helps you to keep track of your
            project!
          </p>
        </div>

        <div className="flex justify-end mt-5 mb-5">
          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={true}
          />
        </div>

        {isEdit ? (
          <div className="grid place-items-center mb-8">
            <form
              className="lg:flex lg:justify-center w-4/5"
              onSubmit={editTodo}
            >
              <input
                type="text"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                className={
                  "border border-gray-400 p-2 mr-4 rounded-md outline-none mb-3"
                }
                placeholder="Enter the content"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer bg-purple-600 rounded-md text-white mb-3 font-medium py-2 px-4"
                onClick={editTodo}
              >
                {isLoading ? "Loading..." : "Edit Todo"}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid place-items-center mb-8">
            <form
              className="lg:flex lg:justify-center w-4/5"
              onSubmit={createTodo}
            >
              <input
                type="text"
                value={title || ""}
                className={
                  "border border-gray-400 p-2 rounded-md outline-none mb-3 mr-4"
                }
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the task"
              />

              <input
                value={time || ""}
                onChange={(e) => setTime(e.target.value)}
                className={
                  "border border-gray-400 p-2 mr-4 rounded-md outline-none mb-3 w-40"
                }
                type="datetime-local"
                placeholder="deadline"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer bg-purple-700 rounded-md text-white mb-3 font-medium py-2 px-4"
                onClick={createTodo}
              >
                {isLoading ? "Loading..." : "Create Todo"}
              </button>
            </form>
          </div>
        )}

        <div className="absolute grid place-items-center">
          <div className="w-4/5">
            {(isLoading || isDeleting || isEditing || isCompleting) && (
              <DotLoader size={120}  color="#rgb(73,163,75)" />
            )}
          </div>
        </div>

        {todos.map((todo: any, index: any) => {
          const date = new Date(Number(todo.deadline._hex));

          return (
            todo.task !== "" && (
              <Fragment key={index}>
                <div
                  className={`mb-4 p-3 rounded-md flex justify-between ${
                    todo.isCompleted
                      ? "bg-green-50 border border-green-500"
                      : "bg-yellow-50 border border-yellow-500"
                  }`}
                >
                  <div className="">
                    <div>Task: {todo.task}</div>
                    <div>
                      Deadline: {date.toLocaleDateString()} -{" "}
                      {date.toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="flex">
                    <div>{todo.isCompleted}</div>

                    {!todo.isCompleted ? (
                      <button
                        className="cursor-pointer block"
                        onClick={() => updateTodo(todo, index)}
                      >
                        <MdEdit size={20} color={"green"} />
                      </button>
                    ) : null}

                    <button
                      // disabled={todo.isCompleted}
                      className={`block mx-4 cursor-pointer`}
                      onClick={() => completeTodo(index)}
                    >
                      {todo.isCompleted ? (
                        <CgToggleOff size={24} color="#8254CE" />
                      ) : (
                        <CgToggleOn size={24} color={"#A1621F"} />
                      )}
                    </button>

                    {!todo.isCompleted ? (
                      <button
                        className="block"
                        disabled={todo.isCompleted}
                        onClick={() => deleteTodo(index)}
                      >
                        <AiFillDelete color="red" size={20} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </Fragment>
            )
          );
        })}
      </div>
    </div>
  );
}

export default App;
