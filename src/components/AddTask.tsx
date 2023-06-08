import React, { useRef } from 'react';

export interface TaskPOST{
    task_status: number;
    task_name: string;
    task_description?: string;
}
export interface TaskGET extends TaskPOST{
    id: string;
}


interface props {
    todo: string;
    descript?: string;
    set_todo: React.Dispatch<React.SetStateAction<string>>;
    set_descript: React.Dispatch<React.SetStateAction<string>>;
    handleAdd:(e: React.FormEvent) => void;
}

const AddTask:React.FC<props> = ({ todo, descript, set_todo, set_descript, handleAdd }) => {
    const InputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="add_task">
        <span className="text_task">Add Task</span>
        <form className='input' onSubmit={(e) => {
            handleAdd(e);
            InputRef.current?.blur();
            }}>
            <label className="label" htmlFor="input__box">Task title:</label>
            <input className="input__box" ref={InputRef} value={todo} onChange = {(e) => set_todo(e.target.value)}>
            </input>
            <label className="label" htmlFor="input__box">Task description:</label>
            <input className="input__box" ref={InputRef} value={descript} onChange = {(e) => set_descript(e.target.value)}>
            </input>
            <button className="input_submit"> 
                ADD
            </button>
        </form>
      </div>
    );
};

export default AddTask;