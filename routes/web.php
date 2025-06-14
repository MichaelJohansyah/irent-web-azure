<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use \App\Models\User;

// Home
Route::get('/', fn() => Inertia::render('welcome'))->name('home');

// Public product routes (move these before auth routes)
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    // Dashboard (role-based)
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Product confirm (requires auth)
    Route::get('/products/{id}/confirm', [ProductController::class, 'confirm'])->name('products.confirm');

    // Admin-only routes
    Route::middleware(['admin'])->group(function () {
        Route::get('admin/users', function () {
            $user = Auth::user();
            $users = User::all();
            return Inertia::render('admin/users', [
                'users' => $users,
                'user' => $user,
            ]);
        })->name('admin.users');

        Route::post('admin/users/{user}/verify', function (User $user) {
            $user->is_verified = true;
            $user->save();
            return redirect()->back();
        })->name('admin.users.verify');
    });

    // Partner-only routes
    Route::middleware(['partner'])->group(function () {
        Route::get('dashboard/add-product', function () {
            return Inertia::render('dashboard/AddProduct');
        })->name('products.add');
        Route::post('dashboard/add-product', [ProductController::class, 'store'])->name('products.store');
    });
});

// Additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';