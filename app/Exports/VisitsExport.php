<?php

namespace App\Exports;

use App\Models\Visit;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class VisitsExport implements FromQuery, WithHeadings, WithMapping
{
    protected $search;
    protected $date;
    private $rowNumber = 0;

    public function __construct($search = null, $date = null)
    {
        $this->search = $search;
        $this->date = $date;
    }

    public function query()
    {
        $query = Visit::with('visitor');

        if ($this->search) {
            $search = $this->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('visitor', function($vq) use ($search) {
                    $vq->where('name', 'like', "%{$search}%")
                       ->orWhere('institution', 'like', "%{$search}%");
                })->orWhere('purpose', 'like', "%{$search}%");
            });
        }

        if ($this->date) {
            $query->whereDate('created_at', $this->date);
        }

        return $query->latest();
    }

    public function headings(): array
    {
        return [
            'No',
            'Visitor Name',
            'Email',
            'Institution',
            'Phone',
            'Purpose of Visit',
            'Status',
            'Check In At',
            'Check Out At',
            'Duration (Minutes)',
        ];
    }

    public function map($visit): array
    {
        $this->rowNumber++;
        
        $statusLabel = [
            'pending' => 'Pending',
            'in' => 'Guest Inside',
            'out' => 'Checked Out',
            'cancelled' => 'Cancelled'
        ];

        return [
            $this->rowNumber,
            $visit->visitor->name,
            $visit->visitor->email,
            $visit->visitor->institution,
            $visit->visitor->phone,
            $visit->purpose,
            $statusLabel[$visit->status] ?? $visit->status,
            $visit->check_in_at ? \Carbon\Carbon::parse($visit->check_in_at)->format('d-m-Y H:i') : 'Not Checked-in',
            $visit->check_out_at ? \Carbon\Carbon::parse($visit->check_out_at)->format('d-m-Y H:i') : '-',
            $visit->duration_minutes !== null ? $visit->duration_minutes . 'm' : '-',
        ];
    }
}
