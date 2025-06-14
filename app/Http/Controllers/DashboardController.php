<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $products = Product::all();

        if ($user->role === 'admin') {
            return Inertia::render('dashboard/AdminDashboard', [
                'products' => $products,
                'user' => $user,
            ]);
        } elseif ($user->role === 'partner') {
            $partnerProducts = Product::where('partner_id', $user->id)->get();
            return Inertia::render('dashboard/PartnerDashboard', [
                'products' => $partnerProducts,
                'user' => $user,
            ]);
        } else {
            return Inertia::render('dashboard/CustomerDashboard', [
                'products' => $products,
                'user' => $user,
            ]);
        }
    }
}
