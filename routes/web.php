<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard now shows products
    Route::get('dashboard', [ProductController::class, 'index'])->name('dashboard');
    // Product detail page
    Route::get('products/{id}', [ProductController::class, 'show'])->name('products.show');
});

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/products/{id}/confirm', [ProductController::class, 'confirm'])->name('products.confirm');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
