<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles with filtering, search, and Data-Saver header detection.
     */
    public function index(Request $request)
    {
        $isDataSaver = $request->header('Save-Data') === 'on' || $request->boolean('data_saver');
        $cacheKey = 'articles_index_' . md5(json_encode($request->all()) . ($isDataSaver ? '_ds' : ''));

        return Cache::remember($cacheKey, 60, function () use ($request, $isDataSaver) {
            $query = Article::query()->with(['category:id,name,slug,color', 'author:id,name,bureau,designation,avatar_url'])->published();

            if ($request->filled('category')) {
                $categorySlug = $request->input('category');
                $query->whereHas('category', function ($q) use ($categorySlug) {
                    $q->where('slug', $categorySlug);
                });
            }

            if ($request->filled('district')) {
                $query->where('location_tag', 'like', '%' . $request->input('district') . '%');
            }

            if ($request->boolean('breaking')) {
                $query->where('is_breaking', true);
            }

            if ($request->boolean('hero')) {
                $query->where('is_hero', true);
            }

            if ($request->boolean('regional')) {
                $query->where('is_featured_regional', true);
            }

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            $articles = $query->orderBy('published_at', 'desc')->paginate($request->input('limit', 12));

            // Transform output if Data-Saver is on to reduce payload
            if ($isDataSaver) {
                $articles->getCollection()->transform(function ($article) {
                    // Exclude heavy fields in list view
                    unset($article->content);
                    return $article;
                });
            }

            return response()->json([
                'success' => true,
                'data_saver_active' => $isDataSaver,
                'data' => $articles->items(),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                    'total' => $articles->total(),
                ]
            ]);
        });
    }

    /**
     * Display the specified article.
     */
    public function show(string $slug, Request $request)
    {
        $article = Article::with(['category', 'subcategory', 'author', 'liveBlog.updates'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count asynchronously or safely
        $article->increment('view_count');

        $related = Article::where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->published()
            ->latest('published_at')
            ->take(4)
            ->get(['id', 'title', 'slug', 'featured_image', 'reading_time_minutes', 'published_at', 'location_tag']);

        return response()->json([
            'success' => true,
            'data' => $article,
            'related' => $related,
        ]);
    }

    /**
     * Get breaking news alerts for the top ticker banner.
     */
    public function breaking()
    {
        $breaking = Cache::remember('breaking_news_ticker', 30, function () {
            return Article::breaking()
                ->select(['id', 'title', 'slug', 'category_id', 'published_at'])
                ->with('category:id,name,slug,color')
                ->latest('published_at')
                ->take(5)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $breaking,
        ]);
    }
}
