<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Exports\VisitsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $visits = Visit::with('visitor')->latest()->get();
        return Inertia::render('Admin/Laporan', [
            'visits' => $visits
        ]);
    }

    // get filtered query
    private function getFilteredQuery(Request $request)
    {
        $query = Visit::with('visitor');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('visitor', function($vq) use ($search) {
                    $vq->where('name', 'like', "%{$search}%")
                       ->orWhere('institution', 'like', "%{$search}%");
                })->orWhere('purpose', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        return $query->latest();
    }

    // export excel
    public function exportExcel(Request $request)
    {
        $search = $request->search;
        $date = $request->date;
        
        return Excel::download(new VisitsExport($search, $date), 'laporan-kunjungan-' . date('Y-m-d') . '.xlsx');
    }

    // export pdf
    public function exportPdf(Request $request)
    {
        $visits = $this->getFilteredQuery($request)->get();
        $pdf = Pdf::loadView('pdf.laporan', compact('visits'));
        return $pdf->download('laporan-kunjungan-' . date('Y-m-d') . '.pdf');
    }
}
