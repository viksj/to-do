<?php

namespace App\Http\Controllers;

use App\Models\TodoTask;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $todoTask = TodoTask::latest()->get();
        return response()->json(['todoTask'=>$todoTask]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'taskName' => 'required|unique:todo_tasks,task_name',
            'taskDiscription' => 'required'
        ]);
        try {
            //code...
            $createTodoTask = TodoTask::create([
                'task_name' => $request->taskName,
                'task_description' => $request->taskDiscription
            ]);
            
            return response()->json(['status'=> 200, 'message'=>'Task save successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['status' => 500, 'message' => 'server Error']);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(TodoTask $todoTask)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TodoTask $todoTask)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id)
    {
        try {
            
            $task = TodoTask::findOrFail($id);
    
            $task->status = true;
    
            $task->save();
    
            return response()->json([
                'status' => 200,
                'message' => 'Task status updated successfully.',
                'task' => $task,
            ], 200);
    
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'message' => 'Task not found.',
            ], 404);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the task.',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            //code...
            $todoTask = TodoTask::findOrfail($id);
            $todoTask->delete();
            return response()->json([
                'status' => 200,
                'message' => 'To-Do Task delete successfully.',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'message' => 'Task not found.',
            ], 404);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the task.',
            ], 500);
        }
        //
    }
}
