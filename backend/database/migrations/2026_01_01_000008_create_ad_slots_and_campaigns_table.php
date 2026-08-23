<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_slots', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Top Leaderboard, In-Article P3, In-Article P7, Sidebar Sticky, Mobile Anchor
            $table->string('slot_key')->unique(); // leaderboard_top, in_feed_native, in_article_p3, in_article_p7, sidebar_banner, mobile_sticky_bottom
            $table->string('dimensions')->default('728x90'); // 728x90, 300x250, 320x50, 970x250
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('ad_campaigns', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ad_slot_id');
            $table->string('advertiser_name');
            $table->string('campaign_title');
            $table->string('banner_image_url');
            $table->string('mobile_banner_image_url')->nullable();
            $table->string('destination_url');
            $table->string('cta_text')->default('Learn More');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->unsignedBigInteger('impressions_count')->default(0);
            $table->unsignedBigInteger('clicks_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_sponsored_content')->default(false);
            $table->timestamps();

            $table->foreign('ad_slot_id')->references('id')->on('ad_slots')->onDelete('cascade');
            $table->index(['ad_slot_id', 'is_active']);
        });

        Schema::create('ad_impressions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ad_campaign_id');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('page_url')->nullable();
            $table->timestamp('recorded_at');

            $table->foreign('ad_campaign_id')->references('id')->on('ad_campaigns')->onDelete('cascade');
            $table->index(['ad_campaign_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_impressions');
        Schema::dropIfExists('ad_campaigns');
        Schema::dropIfExists('ad_slots');
    }
};
