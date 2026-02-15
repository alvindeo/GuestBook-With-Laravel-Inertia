<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitorController extends Controller
{
    public function history(Visitor $visitor)
    {
        $visitor->load(['visits' => function ($query) {
            $query->latest();
        }]);

        return Inertia::render('user/HistoryUser', [
            'visitor' => $visitor,
            'visits' => $visitor->visits,
            'stats' => [
                'total_visits' => $visitor->visits->count(),
                'total_duration' => $visitor->visits->sum('duration_minutes'),
                'last_visit' => $visitor->visits->first()?->created_at,
            ]
        ]);
    }
}
