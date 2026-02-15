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
}
