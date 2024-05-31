<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TaskCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        //
        try {
            $comments = Comment::where('task_id', $id)->get();

            return response()->json(['comments' => $comments]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'message' => 'Task not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the task.'.$e,
            ], 500);
        }
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
            'taskComment' => 'required',
        ]);
        try {
            $comment = Comment::create([
                'task_id' => $request->taskID,
                'task_comments' => $request->taskComment,
            ]);
            return response()->json(['status' => 200, 'message' => 'Add Comment Successfully', 'comment'=>$comment]);
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
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $comment = Comment::findOrfail($id);
            $comment->update([
                'task_comments' => $request->taskComment,
                'updated_at' => Carbon::now()
            ]);
            return response()->json(['status'=>200, 'message' => 'Comment Update Successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the task.',
            ], 500);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'message' => 'Task not found.',
            ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $comment = Comment::findOrfail($id);
            $comment->delete();
            return response()->json(['status'=>200, 'message' => 'Comment delete Successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while updating the task.',
            ], 500);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'message' => 'Task not found.',
            ], 404);
        }
    }
}
