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
    public function update(Request $request, TodoTask $todoTask)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TodoTask $todoTask)
    {
        //
    }
}
