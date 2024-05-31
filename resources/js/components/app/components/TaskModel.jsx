import React, { useCallback, useEffect, useState } from "react";
import { TextArea } from "./formFieldComponents/Input";
import axios from "axios";

const TaskModal = ({ selectedTask, onClose }) => {
    const [taskComment, setTaskComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentEdit, setCommentEdit] = useState({ index: -1, value: '' }); // Track edited comment
    const [error, setError] = useState({});
    
    const handleChangeTaskComment = useCallback((e) => {
        setTaskComment(e.target.value);
    }, []);
    
    const handleEditComment = useCallback((index) => { // Pass index of the comment
        setCommentEdit({ index, value: comments[index].task_comments }); // Set edited comment
    }, [comments]);
    
    const handleDeleteComment = (id) => {
        axios.delete(`/api/comment/${id}`)
            .then(response => {
                setComments(prevComments => prevComments.filter(comment => comment.id !== id));
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
            });
    };

    
    const handleAddComment = () => {
        if (!taskComment) {
            setError({ taskComment: 'Field is required.' });
            return;
        }
        axios.post('/api/comment', { taskComment: taskComment, taskID: selectedTask.id })
            .then(response => {
                setComments(prevComments => [...prevComments, response.data.comment]);
                setTaskComment(''); // Clear input after adding comment
                setError({}); // Clear any existing error
            })
            .catch(error => {
                console.error('Error adding comment:', error);
            });
    };

    const fetchComments = useCallback((id) => {
        axios.get(`/api/getComments/${id}`)
            .then(function(response){
                if(response?.data?.comments)
                setComments(response?.data?.comments)
            })
            .catch(function(error){
                console.error('Comments Error:', error);
            });
    }, []);

    useEffect(() => {
        fetchComments(selectedTask.id);
    }, [selectedTask.id, fetchComments]);

    const handleChangeEditComment = (e) => {
        setCommentEdit(prevState => ({ ...prevState, value: e.target.value })); // Update edited comment
    };

    const handleSaveEditComment = (index) => {
        // Save edited comment to the server and update the state
        const editedComment = commentEdit.value;
        axios.put(`/api/comment/${comments[index].id}`, { taskComment: editedComment })
            .then(response => {
                const updatedComments = [...comments];
                updatedComments[index].task_comments = editedComment;
                setComments(updatedComments);
                setCommentEdit({ index: -1, value: '' }); // Clear edit state
            })
            .catch(error => {
                console.error('Error editing comment:', error);
            });
    };

    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{selectedTask.task_name.charAt(0).toUpperCase() + selectedTask.task_name.slice(1)}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-8">
                                <TextArea label="Task Description" value={selectedTask.task_description} disabled={true} />
                                <TextArea label="Task Comments" value={taskComment} onChange={handleChangeTaskComment} error={error.taskComment} />
                                <button type="button" className="btn btn-sm btn-primary float-end" onClick={handleAddComment}>Save</button>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="card-title">Task Status :
                                            <span className={`badge ms-3 ${selectedTask.status === 'Done' ? 'bg-success' : selectedTask.status === 'In Process' ? 'bg-primary' : 'bg-secondary'}`}>
                                                {selectedTask.status}
                                            </span>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8 mt-3">
                                <p>Comments</p>
                                {comments.map((comment, index)=>(
                                    <React.Fragment key={index}>
                                        <div className="card mt-3">
                                            <div className="card-body">
                                                {index === commentEdit.index ? (
                                                    <TextArea value={commentEdit.value} onChange={handleChangeEditComment} disabled={false} style={{fontSize:'12px'}} />
                                                ) : (
                                                    <TextArea value={comment.task_comments} disabled={true} style={{resize:'none', fontSize:'12px'}} rows="8"/>
                                                )}
                                                {(selectedTask.status !== 'Done') && ( // Render buttons only if status is not 'Done'
                                                    <>
                                                        {index === commentEdit.index ? (
                                                            <a className="btn btn-sm" onClick={() => handleSaveEditComment(index)}>Save</a>
                                                        ) : (
                                                            <a className="btn btn-sm" onClick={() => handleEditComment(index)}>Edit</a>
                                                        )}
                                                        <a className="btn btn-sm" onClick={()=>handleDeleteComment(comment.id)}>Delete</a>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
