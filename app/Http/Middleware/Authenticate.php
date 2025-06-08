<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectUnverifiedUsers
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->is_verified === false) {
            // Allow only register, login, and verification.wait routes
            $allowedRoutes = [
                route('login', [], false),
                route('register', [], false),
                route('verification.wait', [], false),
                '/logout',
            ];
            $currentPath = $request->path();
            $isAllowed = false;
            foreach ($allowedRoutes as $route) {
                if ($currentPath === ltrim($route, '/')) {
                    $isAllowed = true;
                    break;
                }
            }
            if (!$isAllowed) {
                return redirect()->route('verification.wait');
            }
        }

        return $next($request);
    }
}