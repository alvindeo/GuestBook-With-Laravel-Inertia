<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\DashboardController;

use App\Models\Visit;

// Home User
Route::get('/', function () {
    return Inertia::render('user/Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Guestbook
Route::get('/check-visitor/{phone}', [GuestController::class, 'checkVisitor']);
Route::post('/submit-guestbook', [GuestController::class, 'store'])->name('guestbook.submit');

// Scanner
Route::get('/scanner', function () {
    return Inertia::render('Admin/Scanner');
})->middleware(['auth', 'verified'])->name('scanner');

// Laporan
Route::get('/laporan', function () {
    $visits = Visit::with('visitor')->latest()->get();
    return Inertia::render('Admin/Laporan', [
        'visits' => $visits
    ]);
})->middleware(['auth', 'verified'])->name('laporan');

// Export Laporan
Route::get('/laporan/export', function () {
    return response()->json(['message' => 'Fitur export PDF akan segera hadir.']);
})->middleware(['auth', 'verified'])->name('laporan.export');


require __DIR__.'/auth.php';
