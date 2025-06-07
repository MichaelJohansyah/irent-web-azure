<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Show all products
    public function index()
    {
        $products = Product::all();
        return Inertia::render('dashboard', ['products' => $products]);
    }

    // Show a single product
    public function show($id)
    {
        $product = Product::with('partner')->findOrFail($id);
        return Inertia::render('product_detail', ['product' => $product]);
    }

    // (Optional) Add methods for create, store, edit, update, destroy as needed
}
