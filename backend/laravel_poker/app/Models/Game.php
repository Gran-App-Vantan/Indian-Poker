<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;
    protected $fillable = [
        'join_token',
        'join_url',
        'status',
        'meta',
    ];




    protected $casts = [
        'meta' => 'array',
    ];



    public function playingusers()
    {
        return $this->hasMany(Playinguser::class, 'game_id');
    }
}
