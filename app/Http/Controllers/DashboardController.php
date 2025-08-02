<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Redirect based on user role
        switch ($user->role) {
            case 'owner':
                return $this->ownerDashboard();
            case 'admin':
                return $this->adminDashboard();
            case 'manager':
                return $this->managerDashboard();
            case 'kasir':
                return $this->kasirDashboard();
            default:
                abort(403, 'Unauthorized access.');
        }
    }

    public function ownerDashboard()
    {
        return Inertia::render('Owner/Dashboard');
    }

    public function adminDashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function managerDashboard()
    {
        return Inertia::render('Manager/Dashboard');
    }

    public function kasirDashboard()
    {
        return Inertia::render('Kasir/Dashboard');
    }
}
