<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Auth;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    // Dashboard now shows products
    Route::get('dashboard', [ProductController::class, 'index'])->name('dashboard');
    // Product detail page
    Route::get('products/{id}', [ProductController::class, 'show'])->name('products.show');

    // Admin user management (only for verified admins)
    Route::middleware(['admin'])->group(function () {
        Route::get('admin/users', function () {
            $users = \App\Models\User::all();
            return Inertia::render('admin/users', ['users' => $users]);
        })->name('admin.users');

        Route::post('admin/users/{user}/verify', function (\App\Models\User $user) {
            $user->is_verified = true;
            $user->save();
            return redirect()->back();
        })->name('admin.users.verify');
    });
});

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/products/{id}/confirm', [ProductController::class, 'confirm'])->name('products.confirm');
Route::get('/verification/wait', function () {
    return Inertia::render('verification/wait');
})->name('verification.wait');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
