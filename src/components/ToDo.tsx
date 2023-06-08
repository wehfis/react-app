import React, { useState } from 'react';
import { TaskGET, TaskPOST } from './AddTask';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


interface Props {
  todos: TaskGET[];
  set_todos: React.Dispatch<React.SetStateAction<TaskGET[]>>;
  handleUpdate: (taskId: string, updatedTask: TaskPOST) => void;
  handleDelete: (taskId: string) => void;
}

const ToDo: React.FC<Props> = ({ todos, set_todos, handleDelete, handleUpdate}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  
  const openDeleteModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const onDeleteClick = (taskId: string) => {
    handleDelete(taskId);
    closeDeleteModal();
  };

  const openEditModal = (taskId: string, taskName: string, taskDescription: string ) => {
    setSelectedTaskId(taskId);
    setEditTaskName(taskName);
    setEditTaskDescription(taskDescription || "");
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.name === "taskName") {
      setEditTaskName(e.target.value);
    } else if (e.target.name === "taskDescription") {
      setEditTaskDescription(e.target.value);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: TaskPOST = {
      task_status: 0,
      task_name: editTaskName,
      task_description: editTaskDescription
    };
    handleUpdate(selectedTaskId, updatedTask);
    closeEditModal();
  };

  return (
      <Droppable droppableId="todo">
        {(provided) => (
          <div className="ticket1" {...provided.droppableProps} ref={provided.innerRef}>
            <span className="text_ticket1">To Do</span>
            <div className="task_grid">
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <div
                      className="task_ticket1"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef} key={todo.id}>
                      <h1 className="task_title">{todo.task_name} 
                      <span className="icon_edit" onClick={() => openEditModal(todo.id, todo.task_name, todo.task_description || "")}><MdModeEditOutline /></span>
                      <span className="icon_del" onClick={() => openDeleteModal(todo.id)}><MdDelete /></span>
                      </h1>
                      {todo.task_description && <p className="task_description">{todo.task_description}</p>}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
            {deleteModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this task?</p>
              <div className="modal-buttons">
                <button onClick={() => onDeleteClick(selectedTaskId)}>Delete</button>
                <button onClick={closeDeleteModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {editModalOpen && (
          <div className="modal-edit">
            <div className="modal-content-edit">
              <h2>Edit Task</h2>
              <form className="form_edit" onSubmit={handleEditSubmit}>
                <input className='input_edit'
                  type="text"
                  name="taskName"
                  value={editTaskName}
                  onChange={handleEditInputChange}
                  placeholder="Task Name"
                  required
                />
                <textarea
                  name="taskDescription"
                  value={editTaskDescription}
                  onChange={handleEditInputChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                  placeholder="Task Description"
                ></textarea>
                <div className="modal-buttons-edit">
                  <button className="upd_btn" type="submit">Update</button>
                  <button className="cancel_btn" onClick={closeEditModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
          </div>
        )}
      </Droppable>
    );
};

export default ToDo;
