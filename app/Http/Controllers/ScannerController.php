<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScannerController extends Controller
{
    /**
     * Handle visitor scan (check-in or check-out)
     */
    public function scan($visitorId)
    {
        $visitor = Visitor::findOrFail($visitorId);
        
        // Cek apakah ada kunjungan yang sedang pending (belum check-in)
        $pendingVisit = $visitor->visits()
            ->where('status', 'pending')
            ->latest()
            ->first();

        if ($pendingVisit) {
            // Jika ada kunjungan pending, lakukan check-in
            $pendingVisit->update([
                'check_in_at' => now(),
                'status' => 'in',
            ]);

            // Broadcast event check-in
            event(new \App\Events\VisitorCheckedIn($pendingVisit));

            return Inertia::render('Admin/ScanResult', [
                'success' => true,
                'action' => 'check-in',
                'visitor' => $visitor,
                'visit' => $pendingVisit,
                'message' => "{$visitor->name} berhasil check-in pada " . now()->format('H:i')
            ]);
        }

        // Cek apakah ada kunjungan yang sedang aktif (sudah check-in tapi belum check-out)
        $activeVisit = $visitor->visits()
            ->where('status', 'in')
            ->whereNull('check_out_at')
            ->latest()
            ->first();

        if ($activeVisit) {
            // Jika ada kunjungan aktif, lakukan check-out
            $activeVisit->update([
                'check_out_at' => now(),
                'status' => 'out',
            ]);

            // Hitung durasi
            $checkIn = \Carbon\Carbon::parse($activeVisit->check_in_at);
            $checkOut = \Carbon\Carbon::parse($activeVisit->check_out_at);
            $activeVisit->duration_minutes = $checkIn->diffInMinutes($checkOut);
            $activeVisit->save();

            // Broadcast event check-out
            event(new \App\Events\VisitorCheckedOut($activeVisit));

            return Inertia::render('Admin/ScanResult', [
                'success' => true,
                'action' => 'check-out',
                'visitor' => $visitor,
                'visit' => $activeVisit,
                'message' => "{$visitor->name} berhasil check-out pada " . now()->format('H:i')
            ]);
        }

        // Jika tidak ada kunjungan pending atau aktif
        return Inertia::render('Admin/ScanResult', [
            'success' => false,
            'message' => 'Tidak ada kunjungan aktif untuk visitor ini. Silakan daftar terlebih dahulu.',
            'visitor' => $visitor,
        ]);
    }

    /**
     * Handle public scanner process
     */
    public function processPublicScan(Request $request)
    {
        $qrData = $request->input('qr_data');
        
        // 1. Cari berdasarkan barcode_token
        $visit = Visit::where('barcode_token', $qrData)
            ->whereDate('created_at', now()->toDateString()) // Harus di hari yang sama
            ->first();

        if (!$visit) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code tidak valid, sudah kadaluarsa (hanya berlaku 1 hari), atau tidak ditemukan.'
            ], 404);
        }

        $visitor = $visit->visitor;

        // 2. Logika Check-In (Jika status masih 'pending')
        if ($visit->status === 'pending') {
            $visit->update([
                'check_in_at' => now(),
                'status' => 'in'
            ]);

            event(new \App\Events\VisitorCheckedIn($visit));

            return response()->json([
                'success' => true,
                'action' => 'check-in',
                'message' => "Selamat Datang, {$visitor->name}! Anda berhasil CHECK-IN.",
                'visitor' => $visitor
            ]);
        }

        // 3. Logika Check-Out (Jika status sudah 'in')
        if ($visit->status === 'in') {
            $checkIn = \Carbon\Carbon::parse($visit->check_in_at);
            $checkOut = now();
            
            $visit->update([
                'check_out_at' => $checkOut,
                'status' => 'out',
                'duration_minutes' => $checkIn->diffInMinutes($checkOut)
            ]);

            event(new \App\Events\VisitorCheckedOut($visit));

            return response()->json([
                'success' => true,
                'action' => 'check-out',
                'message' => "Terima Kasih, {$visitor->name}! Anda telah berhasil CHECK-OUT.",
                'visitor' => $visitor
            ]);
        }

        // 4. Jika sudah 'out' (Sudah digunakan 2x)
        if ($visit->status === 'out') {
            return response()->json([
                'success' => false,
                'message' => 'QR Code ini sudah digunakan untuk Check-in dan Check-out. Silakan daftar kembali untuk kunjungan berikutnya.'
            ], 400);
        }

        return response()->json([
            'success' => false,
            'message' => 'Status kunjungan tidak valid.'
        ], 400);
    }
}
