import { Fragment, useEffect, useState } from 'react';
import './App.css';
import getTodoContract from './utils/todoContract';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import 
{
 useAccount, useSignMessage, useNetwork 
}
 from 
'wagmi'

type Contract = any;

// CONTRACT ADDRESS: 0x057c50505c000805e2F7dcAD0E5deabC2Fd977Cc
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [indexOfTodo, setIndexOfTodo] = useState<number | null>(null);
  const [time, setTime] = useState<string>("");
  const [updateTitle, setUpdateTitle] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("");
  const [todos, setTodos] = useState<Array<any>>([]);
  // @ts-ignore
  const { ethereum }  = window;  


  const { isConnected, address } = useAccount();


  console.log("gggggggggg: ", {isConnected, address});
  
  
  const getTodos = async () => {
    if (ethereum) {
      setIsLoading(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);        
        const todo = await todoContract.getTask();
        console.log('Retrieved todos...', todo);
        setTodos(todo);
        // setKeyboards(keyboards)
      } finally {
        setIsLoading(false);
      }
    }
  }



  const createTodo = async (e: any) => {
    e.preventDefault();

    if(!isConnected) {
      alert("You need to connect!");
      return;
    }

    const parsedTime = Date.parse(time)

    // console.log({title, s});
    // return;
    
    if (ethereum) {
      setIsLoading(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);
        console.log("TOOODDDDDDOOOOOOOOO: ", todoContract);
        
        const todo = await todoContract.setTask(title, parsedTime);
        // const todo = await todoContract.setTask("This is wonderful", Date.now() * 1000 * 60 * 60);
        console.log('Retrieved todos...', todo)
        // setKeyboards(keyboards)
      } finally {
        setIsLoading(false);
      }
    }
  }

  const editTodo = async (e: any) => {
    e.preventDefault();

    if(!isConnected) {
      alert("You need to connect!");
      return;
    }
    
    if (ethereum) {
      setIsLoading(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);
        console.log("TOOODDDDDDOOOOOOOOO: ", todoContract);


        // (uint256 _taskIndex, string calldata _task)
        
        const todo = await todoContract.updateTask(indexOfTodo, updateTitle);
        // const todo = await todoContract.setTask("This is wonderful", Date.now() * 1000 * 60 * 60);
        console.log('Retrieved todos...', todo)


        setUpdateTime("")
        setUpdateTitle("")
        setIndexOfTodo(null)
        // setKeyboards(keyboards)
      } finally {
        setIsLoading(false);
      }
    }
  }
  
  
  const updateTodo = async(todo: any, index: number) => {
    setUpdateTime(todo.deadline)
    setUpdateTitle(todo.task)
    setIndexOfTodo(index)
    setIsEdit(true);
  }
  
  const completeTodo = async(index: number) => {
    
    if (ethereum) {
      setIsLoading(true);
      try {
        const todoContract: Contract | undefined = getTodoContract(true);
        
        const todo = await todoContract.completeTask(index);
        // const todo = await todoContract.setTask("This is wonderful", Date.now() * 1000 * 60 * 60);
        console.log('Retrieved todos...', todo)

        // setKeyboards(keyboards)
      } finally {
        setIsLoading(false);
      }
    }
  }

  

  console.log({updateTime, updateTitle});
  

  

  useEffect(() => {getTodos()}, [])

  return (
    <div className="mt-12">
      <div className="">


        <div className="text-center">
          <h1 className="text-3xl font-medium">TASK MANAGER</h1>
          <p className="text-lg">Your daily task manager that helps you to keep track of your project!</p>
        </div>

        <ConnectButton
          accountStatus="avatar"
          chainStatus="icon"
          showBalance={true}
        />



        

        {/* <form onSubmit={isEdit ? editTodo : createTodo}>
          <input 
          value={title ||''} name={"title"} 
          onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter the content' />

          <input 
          value={time ||''} name={"time"} 
          onChange={(e) => setTime(e.target.value)} type="datetime" placeholder='deadline' id="" />

          <button type='submit' disabled={isLoading} className="cursor-pointer" onClick={createTodo}>
            {isLoading ?  "Loading..." : isEdit ? "Edit Todo" : 'Create Todo 💳'}
          </button>
        </form> */}






        {
          isEdit ? (
            <form onSubmit={editTodo}>
              <input 
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)} type="text" placeholder='Enter the content' />

              <input 
              value={updateTime}
              onChange={(e) => setUpdateTime(e.target.value)} type="datetime-local" placeholder='deadline' name="" id="" />

              <button type='submit' disabled={isLoading} className="cursor-pointer" onClick={editTodo}>
                {isLoading ?  "Loading..." : "Edit Todo"}
              </button>
            </form>
          ) : (
            <form onSubmit={createTodo}>
              <input 
              value={title ||''}
              onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter the content' />

              <input 
              value={time ||''}
              onChange={(e) => setTime(e.target.value)} type="datetime-local" placeholder='deadline' name="" id="" />

              <button type='submit' disabled={isLoading} className="cursor-pointer" onClick={createTodo}>
                {isLoading ?  "Loading..." : 'Create Todo 💳'}
              </button>
            </form>
          )
        }


        {
          todos.map((todo: any, index: any) => {
            const tid = new Date(Number(todo.deadline._hex) * 1000);
            // console.log(tid);
            
            return (
              <Fragment>
                <div key={index} className={`mb-16 ${todo.isCompleted ? "bg-green-300" : "bg-red-200"}`}>
                  <div>{todo.task}</div>
                  <div>{tid.toLocaleDateString()} - {tid.toLocaleTimeString()}</div>


                  <div>{todo.isCompleted}</div>
                  {!todo.isCompleted ? (<div className='cursor-pointer' onClick={() => updateTodo(todo, index)}>Edit</div>) : null}

                  
                  <button 
                    disabled={todo.isCompleted}
                    className={`${!todo.isCompleted ? 'cursor-pointer' : null}`} 
                    onClick={() => completeTodo(index)}
                  >
                    {todo.isCompleted ? "Completed" : "Mark as Complete"}
                    {/* Complete */}
                  </button>
                </div>
                {/* <div>{tid}</div> */}
              </Fragment>
            )
          })
        }


      </div>
    </div>
  );
}

export default App;
