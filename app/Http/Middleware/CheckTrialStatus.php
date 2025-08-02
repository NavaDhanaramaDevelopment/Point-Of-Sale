<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckTrialStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return $next($request);
        }

        // Check if user is on trial and trial has expired
        if ($user->is_trial && $user->isTrialExpired()) {
            // You can redirect to subscription page or show trial expired message
            return redirect()->route('subscription.index')
                ->with('error', 'Your free trial has expired. Please subscribe to continue using the service.');
        }

        // Add trial info to request for use in views
        if ($user->is_trial) {
            $request->attributes->set('trial_days_remaining', $user->getTrialDaysRemaining());
        }

        return $next($request);
    }
}
