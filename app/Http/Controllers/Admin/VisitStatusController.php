<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use App\Events\VisitorCheckedIn;
use App\Events\VisitorCheckedOut;
use Carbon\Carbon;
use Illuminate\Http\Request;

class VisitStatusController extends Controller
{
    /**
     * Check-in visitor manually (pending → in)
     */
    public function checkIn(Visit $visit)
    {
        // Validasi: hanya pending yang bisa check-in
        if ($visit->status !== 'pending') {
            return back()->with('error', 'This visitor cannot be checked in. Current status: ' . $visit->status);
        }

        // Update status dan waktu check-in
        $visit->update([
            'status' => 'in',
            'check_in_at' => Carbon::now(),
        ]);

        // Broadcast event
        event(new VisitorCheckedIn($visit));

        return back()->with('success', 'Visitor checked in successfully!');
    }

    /**
     * Check-out visitor manually (in → out)
     */
    public function checkOut(Visit $visit)
    {
        // Validasi: hanya status 'in' yang bisa check-out
        if ($visit->status !== 'in') {
            return back()->with('error', 'This visitor cannot be checked out. Current status: ' . $visit->status);
        }

        // Hitung duration
        $checkInTime = Carbon::parse($visit->check_in_at);
        $checkOutTime = Carbon::now();
        $durationMinutes = $checkInTime->diffInMinutes($checkOutTime);

        // Update status, waktu check-out, dan duration
        $visit->update([
            'status' => 'out',
            'check_out_at' => $checkOutTime,
            'duration_minutes' => $durationMinutes,
        ]);

        // Broadcast event
        event(new VisitorCheckedOut($visit));

        return back()->with('success', 'Visitor checked out successfully! Duration: ' . $durationMinutes . ' minutes');
    }

    /**
     * Cancel visitor (pending → cancelled)
     */
    public function cancel(Visit $visit)
    {
        // Validasi: hanya pending yang bisa di-cancel
        if ($visit->status !== 'pending') {
            return back()->with('error', 'This visitor cannot be cancelled. Current status: ' . $visit->status);
        }

        // Update status
        $visit->update([
            'status' => 'cancelled',
        ]);

        // Broadcast event (kita akan buat event baru)
        event(new \App\Events\VisitorCancelled($visit));

        return back()->with('success', 'Visitor registration cancelled successfully!');
    }
}
