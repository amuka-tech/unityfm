<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whistleblower_tips', function (Blueprint $table) {
            $table->id();
            $table->string('source_name')->default('Anonymous Whistleblower');
            $table->string('phone_or_whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->string('district')->default('Lira City');
            $table->string('topic');
            $table->longText('details');
            $table->string('attachment_url')->nullable();
            $table->string('attachment_type')->nullable();
            $table->enum('urgency', ['low', 'medium', 'high', 'breaking'])->default('medium');
            $table->enum('status', ['new', 'under_investigation', 'verified', 'published', 'dismissed'])->default('new');
            $table->text('internal_editorial_notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whistleblower_tips');
    }
};
