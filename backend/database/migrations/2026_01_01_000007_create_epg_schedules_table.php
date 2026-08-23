<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('epg_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('show_name');
            $table->string('presenter_name');
            $table->string('presenter_role')->nullable();
            $table->string('presenter_image')->nullable();
            $table->enum('day_of_week', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->string('category')->default('News'); // News, Talk Show, Agriculture, Sports, Culture, Entertainment
            $table->text('description');
            $table->string('banner_image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_live_broadcast')->default(false);
            $table->timestamps();

            $table->index(['day_of_week', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('epg_schedules');
    }
};
