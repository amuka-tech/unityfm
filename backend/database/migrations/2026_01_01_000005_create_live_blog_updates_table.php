<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_blog_updates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('live_blog_id');
            $table->unsignedBigInteger('author_id');
            $table->string('title')->nullable();
            $table->longText('content');
            $table->string('media_url')->nullable();
            $table->string('media_type')->nullable(); // image, video, tweet, quote
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_key_event')->default(false);
            $table->timestamp('published_at');
            $table->timestamps();

            $table->foreign('live_blog_id')->references('id')->on('live_blogs')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->index(['live_blog_id', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('live_blog_updates');
    }
};
