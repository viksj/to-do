import React, { useCallback, useEffect, useState } from "react";
import { InputField, TextArea } from "./components/formFieldComponents/Input";
import Swal from "sweetalert2";
import axios from "axios";

export default function Index() {
    const [taskName, setTaskName] = useState('');
    const [taskDiscription, setTaskDiscription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState({});

    const handleChangeTaskName = useCallback((e) => {
        setTaskName(e.target.value);
        setError(prevError => ({ ...prevError, taskName: '' }));
    }, []);

    const handleChangeTaskDiscription = useCallback((e) => {
        setTaskDiscription(e.target.value);
        setError(prevError => ({ ...prevError, taskDiscription: '' }));
    }, []);

    const fetchTasks = useCallback(() => {
        axios.get('/api/gettask/')
            .then(response => {
                if (response?.data?.todoTask) {
                    setTasks(response.data.todoTask);
                }
            })
            .catch(error => {
                if (error.response) {
                    const errorsObj = error.response.data;
                    alert(errorsObj.message);
                }
            });
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = async () => {
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

        axios.post('/api/addtask/', { taskName, taskDiscription })
            .then(response => {
                if (response?.data?.status === 200) {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                    // Fetch updated tasks
                    fetchTasks();
                    // Clear form fields
                    setTaskName('');
                    setTaskDiscription('');
                }
            })
            .catch(error => {
                if (error.response) {
                    const errorsObj = error.response.data;
                    alert(errorsObj.message);
                }
            });
    };

    const handleDoneTask = (id) => {
        axios.put(`/api/updatetask/${id}`)
            .then(function (response) {
                if (response?.data?.status === 200) {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: response?.data?.message,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                    setTasks(prevTasks => {
                        return prevTasks.map(task => {
                            if (task.id === id) {
                                return { ...task, status: true }; 
                            }
                            return task;
                        });
                    });
    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response?.data?.message,
                    })
                }

            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Unable to mark the task as done.',
                })
            })
    };

    const handleDeleteTask = (id) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/deletetask/${id}`)
                    .then(response => {
                        if (response?.data?.status === 200) {
                            Swal.fire({
                                title: "Deleted!",
                                text: response?.data?.message,
                                icon: "success"
                            });
                            // Update tasks state by filtering out the deleted task
                            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                        }
                    })
                    .catch(error => {
                        if (error.response) {
                            const errorsObj = error.response.data;
                            alert(errorsObj.message);
                        }
                    });
            }
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="card mt-3">
                        <div className="card-header">
                            <h5 className="card-title">TO Do Task</h5>
                        </div>
                        <div className="card-body">
                            <InputField label="Task Name" type="text" value={taskName} onChange={handleChangeTaskName} error={error?.taskName} />
                            <TextArea label="Task Discription" value={taskDiscription} onChange={handleChangeTaskDiscription} error={error?.taskDiscription} />
                            <button type="button" className="btn btn-sm btn-primary float-end" onClick={handleAddTask}>Add Task</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mt-3">
                    {tasks.length > 0 && (
                        <div className="card">
                            <div className="card-body">
                                {tasks.map((task, index) => (
                                    <React.Fragment key={index}>
                                        <div className="card mt-2">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-8">
                                                        <h6 className="card-title" style={{textTransform: 'capitalize'}}>{task.task_name}</h6>
                                                        <p className="card-text">
                                                            {task.task_description}
                                                        </p>
                                                    </div>
                                                    <div className="col-4 d-flex ">
                                                        {!task.status && (
                                                            <button className="btn btn-sm me-2" onClick={() => handleDoneTask(task.id)}>
                                                                <i className="fa-solid fa-check"></i>
                                                            </button>
                                                        )}
                                                        <button className="btn btn-sm" onClick={() => { handleDeleteTask(task.id) }}><i className="fa-regular fa-trash-can"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
