<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('reporter'); // reporter, editor, producer, super_admin
            $table->string('bureau')->default('Lira City'); // Lira City, Dokolo, Apac, Gulu, Kampala
            $table->string('designation')->nullable(); // e.g. "Senior Northern Uganda Bureau Chief"
            $table->string('avatar_url')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
