import React, { useState } from 'react';
import axios, {AxiosResponse} from 'axios';
import { useEffect } from 'react';
import { TasksURL } from './endpoints';
import { log } from 'console';
import './styles/style.css';
import ToDo from './components/ToDo';
import InProgress from './components/InProgress';
import Done from './components/Done';
import Menu from './components/Menu';
import Title from './components/Title';
import AddTask, { TaskGET, TaskPOST } from './components/AddTask';
import { DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';


const App: React.FC = () => {
  const [todo, set_todo] = useState<string>("");
  const [descript, set_descript] = useState<string>("");
  const [todos, set_todos] = useState<TaskGET[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  const handleCloseModal = () => {
    setValidationError("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo.length > 20) {
      setValidationError("Title cannot exceed 20 characters");
      return;
    }

    if (descript.length > 200) {
      setValidationError("Description cannot exceed 200 characters");
      return;
    }

    if (todo) {
      const newTask: TaskPOST = {
        task_status: 0,
        task_name: todo,
        task_description: descript
      };
      axios.post(TasksURL, newTask)
        .then((response) => {
          const createdTask: TaskGET = response.data;
          set_todos([...todos, createdTask]);
          set_todo("");
          set_descript("");
          setValidationError("");
        })
        .catch((error) => {
          console.log("Error adding task:", error);
        });
    }
  };

  const handleUpdate = (taskId: string, updatedTask: TaskPOST) => {
    if (updatedTask.task_name.length > 20) {
      setValidationError("Title cannot exceed 20 characters");
      return;
    }
  
    if (updatedTask.task_description && updatedTask.task_description.length > 200) {
      setValidationError("Description cannot exceed 200 characters");
      return;
    }
  
    axios
      .put(`${TasksURL}/${taskId}`, updatedTask)
      .then((response) => {
        const updatedTask = response.data;
        const updatedTodos = todos.map((todo) =>
          todo.id === updatedTask.id ? updatedTask : todo
        );
        set_todos(updatedTodos);
      })
      .catch((error) => {
        console.log("Error updating task:", error);
      });
  };

  
  
  const handleDelete = (taskId: string) => {
    axios.delete(`${TasksURL}/${taskId}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== taskId);
        set_todos(updatedTodos);
      })
      .catch((error) => {
        console.log("Error deleting task:", error);
      });
  }; 

  useEffect(() => {
    axios.get<TaskGET[]>(TasksURL)
    .then((response) => {
        set_todos(response.data);
      });
      
  }, []);

  const handleUpdates = (updatedTasks: TaskGET[]) => {
    const updatedTaskPromises = updatedTasks.map((task) => {
      if (task.task_name.length > 20) {
        setValidationError("Title cannot exceed 20 characters");
        return Promise.reject("Title cannot exceed 20 characters");
      }
  
      if (task.task_description && task.task_description.length > 200) {
        setValidationError("Description cannot exceed 200 characters");
        return Promise.reject("Description cannot exceed 200 characters");
      }
  
      return axios.put(`${TasksURL}/${task.id}`, task);
    });
  
    Promise.all(updatedTaskPromises)
      .then((responses) => {
        const updatedTaskData = responses.map((response) => response.data);
        const updatedTodos = todos.map((todo) => {
          const updatedTask = updatedTaskData.find((task) => task.id === todo.id);
          return updatedTask ? updatedTask : todo;
        });
        set_todos(updatedTodos);
      })
      .catch((error) => {
        console.log("Error updating tasks:", error);
      });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
  
    const sourceStatus = getStatusFromId(result.source.droppableId);
    const destinationStatus = getStatusFromId(result.destination.droppableId);
  
    if (sourceStatus === destinationStatus) {
      const reorderedTasks = reorderTasks(
        todos,
        sourceStatus,
        result.source.index,
        result.destination.index
      );
      set_todos(reorderedTasks);
      handleUpdates(reorderedTasks);
  
    } else {
      const updatedTasks = moveTaskToStatus(
        todos,
        sourceStatus,
        destinationStatus,
        result.source.index,
        result.destination.index
      );
      set_todos(updatedTasks);
      handleUpdates(updatedTasks);
    }
  };

  const getStatusFromId = (id: string): number => {
    if (id === 'todo') {
      return 0;
    } else if (id === 'inprogress') {
      return 1;
    } else if (id === 'done') {
      return 2;
    }
    return -1; 
  };

  const reorderTasks = (tasks: TaskGET[], status: number, startIndex: number, endIndex: number): TaskGET[] => {
    const updatedTasks = [...tasks];
    const taskList = updatedTasks.filter((task) => task.task_status === status);
    const [removedTask] = taskList.splice(startIndex, 1);
    taskList.splice(endIndex, 0, removedTask);
    return updatedTasks;
  };

  const moveTaskToStatus = (tasks: TaskGET[], sourceStatus: number, destinationStatus: number, startIndex: number, endIndex: number): TaskGET[] => {
    const updatedTasks = [...tasks];
    const sourceTaskList = updatedTasks.filter((task) => task.task_status === sourceStatus);
    const destinationTaskList = updatedTasks.filter((task) => task.task_status === destinationStatus);
    const [movedTask] = sourceTaskList.splice(startIndex, 1);
    movedTask.task_status = destinationStatus;
    destinationTaskList.splice(endIndex, 0, movedTask);
    return updatedTasks;
  };

    return (
      <>
      <Title/>
      <AddTask todo={todo} descript={descript} set_todo={set_todo} set_descript={set_descript} handleAdd={handleAdd}/>
      {validationError && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
          </div>
          <div className="warning">{validationError}</div>
        </div>
      </div>
    )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <ToDo todos={todos.filter((todo) => todo.task_status === 0)} set_todos={set_todos} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
        <InProgress todos={todos.filter((todo) => todo.task_status === 1)} set_todos={set_todos} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
        <Done todos={todos.filter((todo) => todo.task_status === 2)} set_todos={set_todos} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
      </DragDropContext>
    </>
    );
};

export default App;
