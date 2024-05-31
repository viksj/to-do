<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TodoTask extends Model
{
    use HasFactory;

    protected $table = 'todo_tasks';

    protected $fillable = [
        'task_name',
        'task_description',
        'status',
    ];

    public function comments () {
        return $this->belongsTo(Comment::class, 'id', 'task_id');
    }
}
