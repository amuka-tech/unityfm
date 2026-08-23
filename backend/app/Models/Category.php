<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'parent_id',
        'display_order',
        'is_in_nav',
    ];

    protected $casts = [
        'is_in_nav' => 'boolean',
        'display_order' => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function subcategories()
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('display_order');
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
