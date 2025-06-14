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

    // Store a new product
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:1',
            'rent_price' => 'required|numeric|min:0',
            'max_rent_day' => 'required|integer|min:1|max:30',
            'storage' => 'required|string|max:50',
            'color' => 'required|string|max:50',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('product_images', 'public');
        }

        $product = Product::create([
            'partner_id' => $request->user()->id,
            'name' => $request->name,
            'stock' => $request->stock,
            'rent_price' => $request->rent_price,
            'max_rent_day' => $request->max_rent_day,
            'storage' => $request->storage,
            'color' => $request->color,
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return redirect()->route('dashboard')->with('success', 'Product added successfully!');
    }

    public function confirm($id)
    {
        $product = Product::with('partner')->findOrFail($id);
        return Inertia::render('products/confirm', [
            'product' => $product,  
        ]);
    }


    // (Optional) Add methods for create, store, edit, update, destroy as needed
}
