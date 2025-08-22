<?php

namespace App\Http\Controllers;

use App\Models\Outlet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OutletController extends Controller
{
    /**
     * Display a listing of outlets
     */
    public function index(Request $request)
    {
        if(auth()->user()->role == 'manager'){
            $superuserid = auth()->user()->id;
        }else{
            $superuserid = auth()->user()->super_admin_id;
        }
        $search = $request->input('search');

        $outlets = Outlet::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('code', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%');
            })
            ->where('super_admin_id', $superuserid)
            ->withCount(['users', 'customers', 'products'])
            ->latest()
            ->get();

        return Inertia::render('Owner/Outlets', [
            'outlets' => $outlets,
            'filters' => ['search' => $search]
        ]);
    }

    /**
     * Store a new outlet
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:outlets',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'manager_name' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        Outlet::create($validated);

        return redirect()->back()
            ->with('success', 'Outlet created successfully.');
    }

    /**
     * Update outlet
     */
    public function update(Request $request, Outlet $outlet)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:outlets,code,' . $outlet->id,
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'manager_name' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $outlet->update($validated);

        return redirect()->back()
            ->with('success', 'Outlet updated successfully.');
    }

    /**
     * Delete outlet
     */
    public function destroy(Outlet $outlet)
    {
        // Check if outlet has related data
        if ($outlet->users()->count() > 0 || $outlet->customers()->count() > 0 || $outlet->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete outlet with existing users, customers, or products.');
        }

        $outlet->delete();

        return redirect()->back()
            ->with('success', 'Outlet deleted successfully.');
    }

    /**
     * Toggle outlet status
     */
    public function toggleStatus(Outlet $outlet)
    {
        $outlet->update(['is_active' => !$outlet->is_active]);

        return redirect()->back()
            ->with('success', 'Outlet status updated successfully.');
    }

    // Manager-specific methods

    /**
     * Display outlets for manager
     */
    public function managerIndex(Request $request)
    {
        $search = $request->input('search');
        $user = auth()->user();

        if(auth()->user()->role == 'manager'){
            $superuserid = auth()->user()->id;
        }else{
            $superuserid = auth()->user()->super_admin_id;
        }

        $outlets = Outlet::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('code', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%');
            })
        ->where('super_admin_id', $superuserid)
            ->withCount(['users', 'customers', 'products'])
            ->latest()
            ->get();

        return Inertia::render('Manager/Outlets/Index', [
            'outlets' => $outlets,
            'filters' => ['search' => $search]
        ]);
    }

    /**
     * Show create form for manager
     */
    public function managerCreate()
    {
        return Inertia::render('Manager/Outlets/Create');
    }

    /**
     * Store outlet for manager
     */
    public function managerStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:outlets',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'manager_name' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        Outlet::create($validated);

        return redirect()->route('manager.outlets.index')
            ->with('success', 'Outlet created successfully.');
    }

    /**
     * Show edit form for manager
     */
    public function managerEdit(Outlet $outlet)
    {
        return Inertia::render('Manager/Outlets/Edit', [
            'outlet' => $outlet
        ]);
    }

    /**
     * Update outlet for manager
     */
    public function managerUpdate(Request $request, Outlet $outlet)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:outlets,code,' . $outlet->id,
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'manager_name' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $outlet->update($validated);

        return redirect()->route('manager.outlets.index')
            ->with('success', 'Outlet updated successfully.');
    }

    /**
     * Delete outlet for manager
     */
    public function managerDestroy(Outlet $outlet)
    {
        // Check if outlet has related data
        if ($outlet->users()->count() > 0 || $outlet->customers()->count() > 0 || $outlet->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete outlet with existing users, customers, or products.');
        }

        $outlet->delete();

        return redirect()->route('manager.outlets.index')
            ->with('success', 'Outlet deleted successfully.');
    }
}
