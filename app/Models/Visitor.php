<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Visitor extends Model
{
    protected $fillable = [
        'phone',
        'name',
        'email',
        'institution',
        'verified_at',
    ];

    /**
     * Mutator untuk mengubah nama menjadi Kapital (Uppercase) secara otomatis.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => strtoupper($value),
        );
    }

    /**
     * Mutator untuk mengubah instansi menjadi Kapital secara otomatis (Opsional).
     */
    protected function institution(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? strtoupper($value) : null,
        );
    }


    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
