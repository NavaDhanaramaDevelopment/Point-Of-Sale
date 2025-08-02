<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $user = auth()->user();

        $suppliers = Supplier::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('company', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->withCount('purchaseOrders')
            ->latest()
            ->paginate(15);

        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return Inertia::render('Manager/Suppliers/Index', [
                'suppliers' => $suppliers,
                'filters' => [
                    'search' => $search,
                    'status' => $status,
                ]
            ]);
        }

        return Inertia::render('Supplier/Index', [
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return Inertia::render('Manager/Suppliers/Create');
        }

        return Inertia::render('Supplier/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string'
        ]);

        Supplier::create($validated);

        // Determine redirect route based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return redirect()->route('manager.suppliers.index')
                ->with('success', 'Supplier created successfully.');
        }

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        // Check permission
        if (!auth()->user()->hasPermission('view_suppliers')) {
            abort(403, 'Unauthorized action.');
        }

        $supplier->load(['purchaseOrders' => function($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('Supplier/Show', [
            'supplier' => $supplier
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Supplier $supplier)
    {
        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return Inertia::render('Manager/Suppliers/Edit', [
                'supplier' => $supplier
            ]);
        }

        return Inertia::render('Supplier/Edit', [
            'supplier' => $supplier
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string'
        ]);

        $supplier->update($validated);

        // Determine redirect route based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return redirect()->route('manager.suppliers.index')
                ->with('success', 'Supplier updated successfully.');
        }

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Supplier $supplier)
    {
        // Check if supplier has purchase orders
        if ($supplier->purchaseOrders()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete supplier with existing purchase orders.');
        }

        $supplier->delete();

        // Determine redirect route based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return redirect()->route('manager.suppliers.index')
                ->with('success', 'Supplier deleted successfully.');
        }

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier deleted successfully.');
    }
}
