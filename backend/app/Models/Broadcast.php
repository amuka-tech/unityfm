<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Broadcast extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel_name',
        'stream_url_hls',
        'stream_url_youtube',
        'backup_stream_url',
        'is_live',
        'is_emergency_slate',
        'emergency_slate_message',
        'now_playing_title',
        'now_playing_desc',
        'now_playing_host',
        'up_next_title',
        'up_next_time',
    ];

    protected $casts = [
        'is_live' => 'boolean',
        'is_emergency_slate' => 'boolean',
    ];
}
