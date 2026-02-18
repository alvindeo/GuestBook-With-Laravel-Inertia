<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\VisitorController;
use App\Models\Visit;
use App\Exports\VisitsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

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

Route::get('/scan/{visitor}', [App\Http\Controllers\ScannerController::class, 'scan'])
    ->middleware(['auth', 'verified'])
    ->name('scanner.scan');

// User Scanner (Public)
Route::get('/self-scanner', function () {
    return Inertia::render('user/Scanner');
})->name('user.scanner');

Route::post('/scan-process', [App\Http\Controllers\ScannerController::class, 'processPublicScan'])
    ->name('scanner.process');

// Pendaftar
Route::get('/pendaftar', [App\Http\Controllers\PendaftarController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('pendaftar');

// Tambah User (Admin)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/tambah-user', [App\Http\Controllers\Admin\TambahUserController::class, 'index'])
        ->name('tambah-user');
    Route::post('/tambah-user', [App\Http\Controllers\Admin\TambahUserController::class, 'store'])
        ->name('tambah-user.store');
});

// Laporan
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/laporan', [ReportController::class, 'index'])->name('laporan');
    Route::get('/laporan/pdf', [ReportController::class, 'exportPdf'])->name('laporan.pdf');
    Route::get('/laporan/excel', [ReportController::class, 'exportExcel'])->name('laporan.excel');
    Route::get('/visitor/{visitor}/history', [VisitorController::class, 'history'])->name('visitor.history');
});

// Admin: Manage Visit Status
Route::middleware(['auth', 'verified'])->prefix('admin/visits')->group(function () {
    Route::post('/{visit}/check-in', [App\Http\Controllers\Admin\VisitStatusController::class, 'checkIn'])
        ->name('admin.visits.check-in');
    Route::post('/{visit}/check-out', [App\Http\Controllers\Admin\VisitStatusController::class, 'checkOut'])
        ->name('admin.visits.check-out');
    Route::post('/{visit}/cancel', [App\Http\Controllers\Admin\VisitStatusController::class, 'cancel'])
        ->name('admin.visits.cancel');
});

require __DIR__.'/auth.php';
