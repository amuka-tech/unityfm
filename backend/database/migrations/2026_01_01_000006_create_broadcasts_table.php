<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('broadcasts', function (Blueprint $table) {
            $table->id();
            $table->string('channel_name')->default('Unity TV Uganda');
            $table->string('stream_url_hls')->nullable();
            $table->string('stream_url_youtube')->nullable();
            $table->string('backup_stream_url')->nullable();
            $table->boolean('is_live')->default(true);
            $table->boolean('is_emergency_slate')->default(false);
            $table->string('emergency_slate_message')->nullable();
            $table->string('now_playing_title')->default('Unity News 8PM');
            $table->string('now_playing_desc')->nullable();
            $table->string('now_playing_host')->nullable();
            $table->string('up_next_title')->nullable();
            $table->string('up_next_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('broadcasts');
    }
};
