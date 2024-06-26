<?php

use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\TodoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/gettask', [TodoController::class, 'index']);
Route::post('/addtask', [TodoController::class, 'store']);
Route::put('/updatetask/{id}', [TodoController::class, 'update']);
Route::delete('/deletetask/{id}', [TodoController::class, 'destroy']);
Route::post('/comment', [TaskCommentController::class, 'store']);
Route::get('/getComments/{id}', [TaskCommentController::class, 'index']);
Route::put('/comment/{id}', [TaskCommentController::class, 'update']);
Route::delete('/comment/{id}', [TaskCommentController::class, 'destroy']);
