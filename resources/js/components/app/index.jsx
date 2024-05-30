import React, { useCallback, useState } from "react";
import { InputField, TextArea } from "./components/formFieldComponents/Input";
import Swal from "sweetalert2";

export default function Index() {
    const [taskName, setTaskName] = useState('');
    const [taskDiscription, setTaskDiscription] = useState('');
    const [error, setError] = useState({});
    const handleChangeTaskName = useCallback((e) => setTaskName(e.target.value), []);
    const handleChangeTaskDiscription = useCallback((e) => setTaskDiscription(e.target.value), []);

    const handleAddTask = () => {
        setError({})
        if (!taskName && !taskDiscription) {
            setError({ taskName: "This Task Name Field is required.", taskDiscription: 'This Discription Field is required.' });
            return;
        }
        if (!taskName) {
            setError({ taskName: "This Task Name Field is required." });
            return;
        }
        if (!taskDiscription) {
            setError({ taskDiscription: "This Discription Field is required." });
            return;
        }

    }

    const handleDoneTask = () => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          });
    }

    const handleDeleteTask = () => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            }
          });
          
          
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="card mt-3">
                        <div className="card-header">
                            <h5 class="card-title">TO Do Task</h5>
                        </div>
                        <div className="card-body">
                            <InputField label="Task Name" type="text" value={taskName} onChange={handleChangeTaskName} error={error?.taskName} />
                            <TextArea label="Task Discrition" value={taskDiscription} onChange={handleChangeTaskDiscription} error={error?.taskDiscription} />
                            <button type="button" class="btn btn-sm btn-primary float-end" onClick={handleAddTask}>Add Task</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mt-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-8">
                                            <h6 className="card-title">Task Name</h6>
                                            <p className="card-text">
                                                sdasdas
                                            </p>
                                        </div>
                                        <div className="col-4 d-flex ">
                                            <button className="btn btn-sm" onClick={handleDoneTask}><i className="fa-solid fa-check"></i></button>
                                            <button className="btn btn-sm" onClick={handleDeleteTask}><i className="fa-regular fa-trash-can"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}