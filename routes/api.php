<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Resources\UserResource;


Route::get('/user', function (Request $request) {
    return new UserResource($request->user());
})->middleware('auth:sanctum');

Route::get('/users', function () { // Request $request was unused
    // This route now requires admin privileges
    return UserResource::collection(User::paginate(15));
    })->middleware(['auth:sanctum', 'admin']);

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
        'device_name' => ['required', 'string'], // Device name for the token
    ]);

    if (!Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = User::where('email', $credentials['email'])->firstOrFail();
    $token = $user->createToken($credentials['device_name'])->plainTextToken;

    return response()->json(['token' => $token, 'user' => new UserResource($user)]);
});