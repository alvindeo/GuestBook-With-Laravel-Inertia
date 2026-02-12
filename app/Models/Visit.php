<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'visitor_id',
        'purpose',
        'is_urgent',
        'check_in_at',
        'check_out_at',
        'duration_minutes',
        'status',
        'barcode_token',
    ];

    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }
}
