<?php

namespace App\Http\Controllers;

use App\Models\CustomerDebt;
use App\Models\Customer;
use App\Models\DebtPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerDebtController extends Controller
{
    /**
     * Display customer debts
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $outletId = auth()->user()->outlet_id ?? $request->input('outlet_id');

        $debts = CustomerDebt::with(['customer', 'outlet'])
            ->when($outletId, function ($query) use ($outletId) {
                $query->where('outlet_id', $outletId);
            })
            ->when($search, function ($query) use ($search) {
                $query->whereHas('customer', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                })->orWhere('invoice_number', 'like', '%' . $search . '%');
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get();

        // Load sales for invoice selection
        $sales = \App\Models\Sale::with('customer')
            ->when($outletId, function ($query) use ($outletId) {
                $query->where('outlet_id', $outletId);
            })->get();

        // Load customers for current outlet
        $customers = \App\Models\Customer::where('outlet_id', $outletId)->get();
        return Inertia::render('Debt/CustomerDebts', [
            'debts' => $debts,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'outlet_id' => $outletId
            ],
            'customers' => $customers,
            'sales' => $sales,
        ]);
    }

    /**
     * Store new customer debt
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'outlet_id' => 'required|exists:outlets,id',
            'sale_id' => 'required|exists:sales,id',
            'total_amount' => 'required|numeric|min:0',
            'due_date' => 'required|date|after:today',
            'notes' => 'nullable|string',
        ]);

        // Generate random invoice number for debt
        $validated['invoice_number'] = strtoupper(\Illuminate\Support\Str::random(8));
        $validated['remaining_amount'] = $validated['total_amount'];

        CustomerDebt::create($validated);

        return redirect()->back()
            ->with('success', 'Customer debt created successfully.');
    }

    /**
     * Record payment for customer debt
     */
    public function recordPayment(Request $request, CustomerDebt $debt)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $debt->remaining_amount,
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Create payment record
        DebtPayment::create([
            'debt_type' => 'customer',
            'debt_id' => $debt->id,
            'outlet_id' => $debt->outlet_id,
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'],
            'reference_number' => $validated['reference_number'],
            'notes' => $validated['notes'],
            'created_by' => auth()->id(),
        ]);

        // Update debt
        $debt->paid_amount += $validated['amount'];
        $debt->remaining_amount = $debt->total_amount - $debt->paid_amount;
        $debt->updateStatus();

        return redirect()->back()
            ->with('success', 'Payment recorded successfully.');
    }

    /**
     * Get overdue debts
     */
    public function overdueDebts(Request $request)
    {
        $outletId = auth()->user()->outlet_id ?? $request->input('outlet_id');

        $overdueDebts = CustomerDebt::with(['customer', 'outlet'])
            ->where('due_date', '<', now()->toDateString())
            ->where('status', '!=', 'paid')
            ->when($outletId, function ($query) use ($outletId) {
                $query->where('outlet_id', $outletId);
            })
            ->latest()
            ->get();

        return response()->json(['overdue_debts' => $overdueDebts]);
    }

    /**
     * Update debt
     */
    public function update(Request $request, CustomerDebt $debt)
    {
        $validated = $request->validate([
            'due_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $debt->update($validated);
        $debt->updateStatus();

        return redirect()->back()
            ->with('success', 'Customer debt updated successfully.');
    }

    /**
     * Delete debt
     */
    public function destroy(CustomerDebt $debt)
    {
        if ($debt->paid_amount > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete debt with payments.');
        }

        $debt->delete();

        return redirect()->back()
            ->with('success', 'Customer debt deleted successfully.');
    }
}
