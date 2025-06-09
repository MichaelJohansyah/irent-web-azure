<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectUnverifiedUsers
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->is_verified === false) {
            // Allow only register, login, and verification.wait routes by route name
            $allowedRouteNames = [
                'verification.wait',
                // You may add 'logout' if you have a named route for it
            ];
            $currentRouteName = $request->route() ? $request->route()->getName() : null;
            if (!in_array($currentRouteName, $allowedRouteNames, true)) {
                return redirect()->route('verification.wait');
            }
        }
        return $next($request);
    }
}
