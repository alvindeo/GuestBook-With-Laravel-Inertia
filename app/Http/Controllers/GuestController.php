<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Visitor;
use App\Models\Visit;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\VisitQrMail;

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

        // 2. Simpan Data Kunjungan dengan status 'pending'
        $visit = $visitor->visits()->create([
            'purpose' => $request->purpose,
            'is_urgent' => in_array($request->purpose, ['Komplain', 'Masalah', 'Urgent']), // Otomatis urgent
            'status' => 'pending', // Status pending sampai scan QR
            'check_in_at' => null, // Belum check-in
            'barcode_token' => Str::random(32), // Token unik untuk QR
        ]);

        // 3. Kirim Email QR Code
        try {
            Mail::to($visitor->email)->send(new VisitQrMail($visit));
        } catch (\Exception $e) {
            // Log error tapi tetap lanjut agar user tidak terhambat jika email gagal
            \Illuminate\Support\Facades\Log::error("Gagal kirim email ke {$visitor->email}: " . $e->getMessage());
        }

        // 4. Broadcast event visitor registered
        event(new \App\Events\VisitorRegistered($visitor));

        return back()->with('message', 'Berhasil mengisi buku tamu! Silakan cek email Anda untuk mendapatkan QR Code.');
    }
}
