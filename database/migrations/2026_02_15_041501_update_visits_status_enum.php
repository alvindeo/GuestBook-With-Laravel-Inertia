<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Untuk MySQL, kita perlu mengubah kolom enum
        DB::statement("ALTER TABLE visits MODIFY COLUMN status ENUM('pending', 'in', 'out') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE visits MODIFY COLUMN status ENUM('in', 'out') DEFAULT 'in'");
    }
};
