<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveBlogUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'live_blog_id',
        'author_id',
        'title',
        'content',
        'media_url',
        'media_type',
        'is_pinned',
        'is_key_event',
        'published_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_key_event' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function liveBlog()
    {
        return $this->belongsTo(LiveBlog::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
