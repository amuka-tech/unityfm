<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveBlog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'featured_image',
        'event_location',
        'article_id',
        'is_active',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function updates()
    {
        return $this->hasMany(LiveBlogUpdate::class)->orderBy('published_at', 'desc');
    }

    public function pinnedUpdates()
    {
        return $this->hasMany(LiveBlogUpdate::class)->where('is_pinned', true)->orderBy('published_at', 'desc');
    }
}
