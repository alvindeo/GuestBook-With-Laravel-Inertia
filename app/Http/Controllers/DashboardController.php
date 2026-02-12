<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\Visitor;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total Tamu (Basis Data Pengunjung)
        $totalTamu = Visitor::count();

        // 2. Retensi (Loyalitas Tinggi - Tamu yang datang lebih dari sekali)
        $retensiCount = Visitor::has('visits', '>', 1)->count();

        // 3. Aktif (Sedang Berkunjung)
        $aktifGuests = Visit::with('visitor')
            ->where('status', 'in')
            ->latest()
            ->get();
        $aktifCount = $aktifGuests->count();

        // 4. Rerata (Menit per tamu)
        $rerataMenit = Visit::whereNotNull('duration_minutes')->avg('duration_minutes') ?? 0;

        // 5. Data untuk Chart Tren (Kunjungan 7 hari terakhir)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Visit::whereDate('created_at', $date)->count();
            $chartData[] = [
                'label' => $date->format('d M'),
                'value' => $count
            ];
        }

        // 6. Data untuk Chart Instansi (Pie Chart)
        $instansiData = Visitor::select('institution', \DB::raw('count(*) as total'))
            ->groupBy('institution')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function($item) {
                return [
                    'label' => $item->institution ?? 'Lainnya',
                    'value' => $item->total
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalTamu' => $totalTamu,
                'retensi' => $retensiCount,
                'aktif' => $aktifCount,
                'rerata' => round($rerataMenit, 1),
                'activeGuests' => $aktifGuests
            ],
            'chartData' => $chartData,
            'instansiData' => $instansiData
        ]);

    }
}

