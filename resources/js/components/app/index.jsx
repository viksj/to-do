import React, { useCallback, useEffect, useState } from "react";
import { InputField, TextArea } from "./components/formFieldComponents/Input";
import Swal from "sweetalert2";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TaskModal from "./components/TaskModel";

export default function Index() {
    const [taskName, setTaskName] = useState('');
    const [taskDiscription, setTaskDiscription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

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
                    fetchTasks();
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
            .then(response => {
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
                    });
                }

            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Unable to mark the task as done.',
                });
            });
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

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const taskId = result.draggableId;
            const newStatus = destination.droppableId;

            axios.put(`/api/updatetask/${taskId}`, { status: newStatus })
                .then(response => {
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
                        fetchTasks();
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong! Unable to update the task status.',
                    });
                });
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
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
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="row justify-content-between">
                    {["To Do", "Selected For Development", "In Process", "Done"].map((status, index) => (
                        <div className="col-md-3 mt-3" key={index}>
                            <h6>{status}</h6>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="card">
                                        <div className="card-body">
                                            {getTasksByStatus(status).map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="card mt-2" onClick={() => handleTaskClick(task)}>
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <h6 className="card-title" style={{ textTransform: 'capitalize' }}>{task.task_name}</h6>
                                                                        <p className="card-text">
                                                                            {task.task_description}
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-4 d-flex">
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
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
            {showModal && <TaskModal selectedTask={selectedTask} onClose={handleCloseModal} />}
        </div>
    );
}
