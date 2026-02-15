<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TambahUserController extends Controller
{
    /**
     * Show the form for adding a new visitor
     */
    public function index()
    {
        return Inertia::render('Admin/TambahUser');
    }

    /**
     * Store a new visitor from admin
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'institution' => 'required|string|max:255',
            'purpose' => 'required|string',
        ]);

        // 1. Simpan/Update Profil Visitor
        $visitor = Visitor::updateOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'institution' => $validated['institution']
            ]
        );

        // Trigger event jika visitor baru terdaftar
        if ($visitor->wasRecentlyCreated) {
            event(new \App\Events\VisitorRegistered($visitor));
        }

        // 2. Simpan Data Kunjungan dengan status 'pending'
        $visit = $visitor->visits()->create([
            'purpose' => $validated['purpose'],
            'is_urgent' => in_array($validated['purpose'], ['Komplain', 'Masalah', 'Urgent']),
            'status' => 'pending',
            'check_in_at' => null,
        ]);

        // 3. Broadcast event visitor registered
        event(new \App\Events\VisitorRegistered($visitor));

        return redirect()->route('tambah-user')->with('success', 'Pengunjung berhasil ditambahkan!');
    }
}
