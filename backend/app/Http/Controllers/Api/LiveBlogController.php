<?php

namespace App\Http\Controllers\Api;

use App\Events\LiveBlogUpdated;
use App\Http\Controllers\Controller;
use App\Models\LiveBlog;
use App\Models\LiveBlogUpdate;
use Illuminate\Http\Request;

class LiveBlogController extends Controller
{
    /**
     * Get live blog timeline and updates.
     */
    public function show(string $slug)
    {
        $liveBlog = LiveBlog::with([
            'updates.author:id,name,designation,avatar_url',
            'article:id,title,slug,featured_image'
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $liveBlog,
        ]);
    }

    /**
     * Post an update to a live blog (broadcasts to Laravel Reverb).
     */
    public function storeUpdate(Request $request, string $slug)
    {
        $liveBlog = LiveBlog::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'media_url' => 'nullable|url',
            'media_type' => 'nullable|string',
            'is_pinned' => 'boolean',
            'is_key_event' => 'boolean',
        ]);

        $update = $liveBlog->updates()->create([
            'author_id' => $request->user()?->id ?? 1,
            'title' => $validated['title'] ?? null,
            'content' => $validated['content'],
            'media_url' => $validated['media_url'] ?? null,
            'media_type' => $validated['media_type'] ?? null,
            'is_pinned' => $validated['is_pinned'] ?? false,
            'is_key_event' => $validated['is_key_event'] ?? false,
            'published_at' => now(),
        ]);

        // Load author info
        $update->load('author:id,name,designation,avatar_url');

        // Broadcast event via Laravel Reverb
        broadcast(new LiveBlogUpdated($liveBlog->id, $update))->toOthers();

        return response()->json([
            'success' => true,
            'data' => $update,
        ], 201);
    }
}
