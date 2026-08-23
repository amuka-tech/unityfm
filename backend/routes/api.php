<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\BroadcastController;
use App\Http\Controllers\Api\EpgController;
use App\Http\Controllers\Api\LiveBlogController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\WhistleblowerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Unity TV API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Articles & Editorial Feed
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);
    Route::get('/breaking-news', [ArticleController::class, 'breaking']);

    // Live TV Stream & Broadcast Center
    Route::get('/broadcast/current', [BroadcastController::class, 'current']);

    // EPG Weekly TV Schedule
    Route::get('/epg/schedule', [EpgController::class, 'index']);
    Route::get('/epg/featured', [EpgController::class, 'featured']);

    // Live Blog Engine
    Route::get('/live-blogs/{slug}', [LiveBlogController::class, 'show']);
    Route::post('/live-blogs/{slug}/updates', [LiveBlogController::class, 'storeUpdate'])->middleware('auth:sanctum');

    // Monetization & Ad Slots
    Route::get('/ads/active', [AdController::class, 'active']);
    Route::post('/ads/{id}/impression', [AdController::class, 'trackImpression']);
    Route::post('/ads/{id}/click', [AdController::class, 'trackClick']);

    // Whistleblower News Tip Submission
    Route::post('/whistleblower', [WhistleblowerController::class, 'store']);

    // Meta: Lira Weather & Forex Tracker
    Route::get('/meta/weather-currency', [MetaController::class, 'weatherAndCurrency']);
});
