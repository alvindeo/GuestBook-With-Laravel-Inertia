<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendaftarController extends Controller
{
    public function index()
    {
        // Ambil semua visit dengan status 'pending' (sudah daftar tapi belum check-in)
        $pendingVisits = Visit::with('visitor')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'visitor_id' => $visit->visitor_id,
                    'visitor_name' => $visit->visitor->name,
                    'institution' => $visit->visitor->institution,
                    'phone' => $visit->visitor->phone,
                    'email' => $visit->visitor->email,
                    'purpose' => $visit->purpose,
                    'is_urgent' => (bool) $visit->is_urgent, // Convert to boolean
                    'registered_at' => $visit->created_at,
                    'status' => $visit->status,
                ];
            });

        return Inertia::render('Admin/Pendaftar', [
            'pendingVisits' => $pendingVisits,
        ]);
    }
}
