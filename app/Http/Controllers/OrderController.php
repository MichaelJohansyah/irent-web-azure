<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'partner_id' => 'required|exists:users,id',
            'duration' => 'required|integer|min:1',
            'start_date' => 'required|date|after_or_equal:today',
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // Check if duration doesn't exceed max
        if ($request->duration > $product->max_rent_day) {
            return back()->withErrors(['duration' => 'Rent duration exceeds maximum allowed days.']);
        }

        // Calculate end date and total price
        $startDate = Carbon::parse($request->start_date);
        $endDate = $startDate->copy()->addDays($request->duration);
        $totalPrice = $product->rent_price * $request->duration;

        // Create the order
        $order = Order::create([
            'customer_id' => auth()->id(),
            'product_id' => $request->product_id,
            'partner_id' => $request->partner_id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'duration' => $request->duration,
            'total_price' => $totalPrice,
            'status' => 'waiting',
        ]);

        // Reduce product stock
        $product->decrement('stock', 1);

        return redirect()->route('orders.index')->with('success', 'Order placed successfully!');
    }

    public function index()
    {
        $orders = Order::with(['product', 'partner'])
            ->where('customer_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('orders/history', [
            'orders' => $orders
        ]);
    }
}