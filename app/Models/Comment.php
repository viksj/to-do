<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comments';

    protected $fillable = [
        'task_id',
        'task_comments',
    ];


    public function todoTasks () {
        return $this->hasMany(TodoTask::class, 'task_id', 'id');
    }
}
