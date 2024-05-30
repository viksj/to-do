import React, { useCallback, useState } from "react";
import { InputField, TextArea } from "./components/formFieldComponents/Input";

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
            </div>
        </div>
    );
}