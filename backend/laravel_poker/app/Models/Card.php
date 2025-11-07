<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = [
        'number',
        'type',
        'has_user_id',
        'is_in_deck',
        'is_current_option',
    ];
}
