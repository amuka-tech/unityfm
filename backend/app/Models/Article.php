<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Article extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'sub_headline',
        'excerpt',
        'content',
        'featured_image',
        'image_caption',
        'image_credit',
        'location_tag',
        'category_id',
        'subcategory_id',
        'author_id',
        'status',
        'is_breaking',
        'is_hero',
        'is_featured_regional',
        'is_video_story',
        'video_url',
        'reading_time_minutes',
        'view_count',
        'tags',
        'key_takeaways',
        'published_at',
    ];

    protected $casts = [
        'is_breaking' => 'boolean',
        'is_hero' => 'boolean',
        'is_featured_regional' => 'boolean',
        'is_video_story' => 'boolean',
        'tags' => 'array',
        'key_takeaways' => 'array',
        'published_at' => 'datetime',
        'reading_time_minutes' => 'integer',
        'view_count' => 'integer',
    ];

    public function registerMediaConversions(Media $media = null): void
    {
        // High quality webp conversion
        $this->addMediaConversion('desktop')
            ->format('webp')
            ->quality(85)
            ->width(1200);

        // Low bandwidth Data-Saver conversion (optimized for 3G networks in Uganda)
        $this->addMediaConversion('data_saver')
            ->format('webp')
            ->quality(50)
            ->width(600);

        // Thumbnail
        $this->addMediaConversion('thumb')
            ->format('webp')
            ->quality(70)
            ->width(360)
            ->height(240);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Category::class, 'subcategory_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function liveBlog()
    {
        return $this->hasOne(LiveBlog::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    public function scopeBreaking($query)
    {
        return $query->published()->where('is_breaking', true);
    }

    public function scopeHero($query)
    {
        return $query->published()->where('is_hero', true);
    }

    public function scopeRegional($query)
    {
        return $query->published()->where('is_featured_regional', true);
    }
}
