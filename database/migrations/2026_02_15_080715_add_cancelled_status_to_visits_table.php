<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'cancelled' status to visits table enum
        DB::statement("ALTER TABLE visits MODIFY COLUMN status ENUM('pending', 'in', 'out', 'cancelled') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'cancelled' status from enum
        DB::statement("ALTER TABLE visits MODIFY COLUMN status ENUM('pending', 'in', 'out') DEFAULT 'pending'");
    }
};
