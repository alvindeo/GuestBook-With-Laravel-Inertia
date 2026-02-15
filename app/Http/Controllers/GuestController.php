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

        // Trigger event jika visitor baru terdaftar
        if ($visitor->wasRecentlyCreated) {
            event(new \App\Events\VisitorRegistered($visitor));
        }

        // 2. Simpan Data Kunjungan dengan status 'pending'
        $visit = $visitor->visits()->create([
            'purpose' => $request->purpose,
            'is_urgent' => in_array($request->purpose, ['Komplain', 'Masalah', 'Urgent']), // Otomatis urgent
            'status' => 'pending', // Status pending sampai scan QR
            'check_in_at' => null, // Belum check-in
        ]);

        // 3. Broadcast event visitor registered (bukan checked-in)
        event(new \App\Events\VisitorRegistered($visitor));

        return back()->with('message', 'Berhasil mengisi buku tamu!');
    }
}
