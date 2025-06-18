<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
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
        // Use total_price from request if present, otherwise fallback
        $totalPrice = $request->has('total_price') ? $request->total_price : ($product->rent_price * $request->duration);

        // Create the order
        $order = Order::create([
            'customer_id' => Auth::user()->id,
            'product_id' => $request->product_id,
            'partner_id' => $product->partner_id, // Set from product
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

    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role === 'partner') {
            // Show orders for products owned by this partner, only if product exists
            $orders = Order::with(['product', 'customer'])
                ->where('partner_id', $user->id)
                ->whereHas('product')
                ->orderBy('created_at', 'desc')
                ->get();
            return Inertia::render('orders/history', [
                'orders' => $orders
            ]);
        } else {
            // Default: show orders for customer, only if product exists
            $orders = Order::with(['product', 'partner'])
                ->where('customer_id', $user->id)
                ->whereHas('product')
                ->orderBy('created_at', 'desc')
                ->get();
            return Inertia::render('orders/history', [
                'orders' => $orders
            ]);
        }
    }
    public function apiIndex()
    {
        $orders = \App\Models\Order::with(['product', 'customer', 'partner'])->get();
        return OrderResource::collection($orders);
    }

    // API endpoint: store order from mobile app
    public function apiStore(Request $request)
    {
        // Accept JSON and always return JSON
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'customer_id' => 'required|exists:users,id',
            'partner_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'duration' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|string',
        ]);

        $order = Order::create($validated);
        $order->load(['product', 'customer', 'partner']);
        return response()->json([
            'success' => true,
            'order' => new OrderResource($order)
        ], 201);
    }
    public function adminIndex()
    {
        $orders = Order::with(['product', 'customer', 'partner'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('admin/ManageOrders', [
            'orders' => $orders
        ]);
    }
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:waiting,ready,rented,return_now,finished'
        ]);
        $order->status = $request->status;
        $order->save();
        return redirect()->back()->with('success', 'Order status updated.');
    }
    public function partnerConfirm(Request $request, Order $order)
    {
        $request->validate([
            'pickup_address' => 'required|string',
            'contact_number' => 'required|string',
            'pickup_time' => 'required|string',
            'notes' => 'nullable|string',
            'return_information' => 'nullable|string', // allow this field
        ]);
        $order->pickup_address = $request->pickup_address;
        $order->contact_number = $request->contact_number;
        $order->pickup_time = $request->pickup_time;
        $order->notes = $request->notes;
        if ($request->has('return_information')) {
            $order->return_information = $request->return_information;
        }
        // Only set status to 'ready' if requested and only from 'waiting'
        if ($request->has('status') && $request->status === 'ready' && $order->status === 'waiting') {
            $order->status = 'ready';
        }
        $order->save();
        return response()->json(['success' => true]);
    }

    public function partnerCancel(Request $request, Order $order)
    {
        $order->status = 'canceled';
        $order->save();
        return response()->json(['success' => true]);
    }
    public function partnerOrderList(Request $request)
    {
        $user = $request->user();
        $orders = \App\Models\Order::with(['product', 'customer'])
            ->where('partner_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return \Inertia\Inertia::render('orders/partner-list', [
            'orders' => $orders
        ]);
    }

    // Partner marks order as picked up (status: rented)
    public function partnerPickedUp(Request $request, Order $order)
    {
        // Only allow if current status is 'ready'
        if ($order->status !== 'ready') {
            return response()->json(['success' => false, 'message' => 'Order is not ready for pickup.'], 400);
        }
        $order->status = 'rented';
        $order->save();
        return response()->json(['success' => true]);
    }

    // Partner finishes order (status: finished)
    public function partnerFinish(Request $request, Order $order)
    {
        // Only allow if current status is 'return_now'
        if ($order->status !== 'return_now') {
            return response()->json(['success' => false, 'message' => 'Order is not ready to be finished.'], 400);
        }
        if ($request->has('return_information')) {
            $order->return_information = $request->return_information;
        }
        $order->status = 'finished';
        $order->save();
        return response()->json(['success' => true]);
    }
}