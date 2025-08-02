<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerPoint;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Customer::query();

        if ($request->search) {
            $query->search($request->search);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->active);
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Customer/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'active'])
        ]);
    }

    public function create(): Response
    {
        $outlets = \App\Models\Outlet::where('is_active', true)->get(['id', 'name', 'code']);
        return Inertia::render('Customer/Create', [
            'outlets' => $outlets
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|unique:customers,phone',
            'email' => 'nullable|email|unique:customers,email',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'discount_percentage' => 'nullable|numeric|min:0|max:100'
        ]);

        Customer::create($request->all());

        return redirect()->route('customers.index')->with('success', 'Customer berhasil ditambahkan');
    }

    public function show(Customer $customer): Response
    {
        $customer->load(['sales.saleItems.product', 'points']);

        $recentSales = $customer->sales()
            ->with(['saleItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $pointHistory = $customer->points()
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Customer/Show', [
            'customer' => $customer,
            'recentSales' => $recentSales,
            'pointHistory' => $pointHistory,
            'stats' => [
                'total_transactions' => $customer->sales()->count(),
                'average_transaction' => $customer->sales()->avg('grand_total') ?? 0,
                'last_transaction' => $customer->sales()->latest()->first()?->created_at,
                'points_earned' => $customer->points()->where('type', 'earned')->sum('points'),
                'points_redeemed' => abs($customer->points()->where('type', 'redeemed')->sum('points'))
            ]
        ]);
    }

    public function edit(Customer $customer): Response
    {
        $outlets = \App\Models\Outlet::where('is_active', true)->get(['id', 'name', 'code']);
        return Inertia::render('Customer/Edit', [
            'customer' => $customer,
            'outlets' => $outlets
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|unique:customers,phone,' . $customer->id,
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean'
        ]);

        $customer->update($request->all());

        return redirect()->route('customers.index')->with('success', 'Customer berhasil diupdate');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')->with('success', 'Customer berhasil dihapus');
    }

    public function adjustPoints(Request $request, Customer $customer)
    {
        $request->validate([
            'points' => 'required|integer',
            'description' => 'required|string',
            'type' => 'required|in:add,subtract'
        ]);

        $points = $request->type === 'add' ? $request->points : -$request->points;

        if ($request->type === 'subtract' && $customer->points < $request->points) {
            return back()->withErrors(['points' => 'Poin tidak mencukupi']);
        }

        // Update customer points
        $customer->increment('points', $points);

        // Record point transaction
        CustomerPoint::create([
            'customer_id' => $customer->id,
            'type' => 'adjusted',
            'points' => $points,
            'description' => $request->description,
            'reference_type' => 'manual_adjustment',
            'reference_id' => auth()->id()
        ]);

        return back()->with('success', 'Poin berhasil disesuaikan');
    }

    public function search(Request $request)
    {
        $search = $request->get('q');

        $customers = Customer::search($search)
            ->active()
            ->limit(10)
            ->get(['id', 'name', 'phone', 'points']);

        return response()->json($customers);
    }

    public function loyaltyReport(): Response
    {
        $topCustomers = Customer::orderBy('points', 'desc')
            ->limit(20)
            ->get();

        $monthlyStats = Customer::selectRaw('
                COUNT(*) as new_customers,
                SUM(total_spent) as total_revenue,
                AVG(total_spent) as avg_spent_per_customer,
                SUM(points) as total_points_issued
            ')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->first();

        return Inertia::render('Customer/LoyaltyReport', [
            'topCustomers' => $topCustomers,
            'monthlyStats' => $monthlyStats,
            'pointsStats' => [
                'total_points_in_system' => Customer::sum('points'),
                'total_points_earned' => CustomerPoint::where('type', 'earned')->sum('points'),
                'total_points_redeemed' => abs(CustomerPoint::where('type', 'redeemed')->sum('points')),
                'active_customers' => Customer::where('is_active', true)->count()
            ]
        ]);
    }
}
