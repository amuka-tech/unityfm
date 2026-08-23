<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('sub_headline')->nullable();
            $table->text('excerpt');
            $table->longText('content'); // Rich HTML or JSON blocks
            $table->string('featured_image');
            $table->string('image_caption')->nullable();
            $table->string('image_credit')->nullable();
            $table->string('location_tag')->default('Lira City'); // Lira City, Dokolo, Oyam, Kampala, etc.
            
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('subcategory_id')->nullable();
            $table->unsignedBigInteger('author_id');
            
            $table->string('status')->default('published'); // draft, published, archived
            $table->boolean('is_breaking')->default(false);
            $table->boolean('is_hero')->default(false);
            $table->boolean('is_featured_regional')->default(false);
            $table->boolean('is_video_story')->default(false);
            $table->string('video_url')->nullable();
            $table->integer('reading_time_minutes')->default(3);
            $table->unsignedBigInteger('view_count')->default(0);
            
            $table->json('tags')->nullable();
            $table->json('key_takeaways')->nullable();
            
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->index(['status', 'published_at']);
            $table->index(['is_breaking', 'status']);
            $table->index(['is_hero', 'status']);
            $table->index(['category_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
