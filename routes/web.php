<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use \App\Models\User;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FeedbackController;

// Home
Route::get('/', fn() => Inertia::render('welcome'))->name('home');

// Public product routes 
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    // Dashboard (role-based)
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Product confirm (requires auth)
    Route::get('/products/{id}/confirm', [ProductController::class, 'confirm'])->name('products.confirm');

    // Feedback submission (for all authenticated users)
    Route::get('/feedback', [FeedbackController::class, 'create'])->name('feedback.create');
    Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');

    Route::get('/feedback/confirmation', [FeedbackController::class, 'confirmation'])
    ->name('feedback.confirmation');

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

        Route::delete('admin/users/{user}', function (User $user) {
            if (in_array($user->role, ['partner', 'customer'])) {
                $user->delete();
            }
            return redirect()->back();
        })->name('admin.users.delete');

        Route::get('admin/orders', [OrderController::class, 'adminIndex'])->name('admin.orders');
        Route::post('admin/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');

        // Feedback management
        Route::get('/admin/feedback', [FeedbackController::class, 'index'])->name('admin.feedback');
    });

    // Partner-only routes
    Route::middleware(['partner'])->group(function () {
        Route::get('dashboard/add-product', function () {
            return Inertia::render('dashboard/AddProduct');
        })->name('products.add');
        Route::post('dashboard/add-product', [ProductController::class, 'store'])->name('products.store');
        Route::get('dashboard/edit-product/{id}', [ProductController::class, 'edit'])->name('products.edit');
        Route::post('dashboard/edit-product/{id}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('dashboard/edit-product/{id}', [ProductController::class, 'destroy'])->name('products.delete');
        Route::get('/orders/partner-list', [\App\Http\Controllers\OrderController::class, 'partnerOrderList'])->name('orders.partnerList');
    });
    
    // Order routes
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/partner-confirm', [OrderController::class, 'partnerConfirm'])->name('orders.partnerConfirm');
    Route::post('/orders/{order}/partner-cancel', [OrderController::class, 'partnerCancel'])->name('orders.partnerCancel');
    Route::post('/orders/{order}/partner-pickedup', [\App\Http\Controllers\OrderController::class, 'partnerPickedUp'])->name('orders.partnerPickedUp');
    Route::post('/orders/{order}/partner-finish', [\App\Http\Controllers\OrderController::class, 'partnerFinish'])->name('orders.partnerFinish');
});

// Additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';