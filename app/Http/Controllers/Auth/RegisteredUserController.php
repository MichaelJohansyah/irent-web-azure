<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'ktp_photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Handle KTP photo upload
        $ktpPhotoPath = null;
        if ($request->hasFile('ktp_photo')) {
            $ktpPhotoPath = $request->file('ktp_photo')->store('ktp_photos', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'ktp_photo' => $ktpPhotoPath,
            'password' => Hash::make($request->password),
            'is_verified' => false, // User must be verified by admin
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect to a waiting-for-verification page if not verified
        if (!$user->is_verified) {
            return to_route('verification.wait');
        }

        return to_route('dashboard');
    }
}
