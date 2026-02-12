<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Visitor;
use App\Models\Visit;

class GuestController extends Controller
{
    // Fungsi untuk cek apakah user pernah berkunjung (Auto-fill)
    public function checkVisitor($phone) {
        $visitor = Visitor::where('phone', $phone)->first();
        return response()->json($visitor);
    }

    // Fungsi simpan data tamu
    public function store(Request $request) {
        // 1. Simpan/Update Profil Visitor
        $visitor = Visitor::updateOrCreate(
            ['phone' => $request->phone],
            ['name' => $request->name, 'email' => $request->email, 'institution' => $request->institution]
        );

        // 2. Simpan Data Kunjungan
        $visit = $visitor->visits()->create([
            'purpose' => $request->purpose,
            'is_urgent' => in_array($request->purpose, ['Komplain', 'Masalah', 'Urgent']), // Otomatis urgent
            'status' => 'in',
        ]);

        // 3. Broadcast ke Dashboard Admin secara Real-time
        event(new \App\Events\GuestCheckedIn($visit));

        return back()->with('message', 'Berhasil mengisi buku tamu!');
    }
}
