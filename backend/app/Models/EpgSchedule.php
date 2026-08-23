<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EpgSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'show_name',
        'presenter_name',
        'presenter_role',
        'presenter_image',
        'day_of_week',
        'start_time',
        'end_time',
        'category',
        'description',
        'banner_image',
        'is_featured',
        'is_live_broadcast',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_live_broadcast' => 'boolean',
    ];
}
