<?php

use App\Models\Visit;
use App\Models\Visitor;

echo "=== CHECKING DATABASE ===\n\n";

echo "Total Visitors: " . Visitor::count() . "\n";
echo "Total Visits: " . Visit::count() . "\n\n";

echo "=== VISITS BY STATUS ===\n";
echo "Pending: " . Visit::where('status', 'pending')->count() . "\n";
echo "In: " . Visit::where('status', 'in')->count() . "\n";
echo "Out: " . Visit::where('status', 'out')->count() . "\n\n";

echo "=== LATEST 5 VISITS ===\n";
Visit::with('visitor')->latest()->take(5)->get()->each(function($visit) {
    echo sprintf(
        "ID: %d | Visitor: %s | Status: %s | Check-in: %s | Created: %s\n",
        $visit->id,
        $visit->visitor->name ?? 'N/A',
        $visit->status,
        $visit->check_in_at ?? 'NULL',
        $visit->created_at
    );
});
