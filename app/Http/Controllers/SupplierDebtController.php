<?php

namespace App\Http\Controllers;

use App\Models\SupplierDebt;
use App\Models\Supplier;
use App\Models\DebtPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierDebtController extends Controller
{
    /**
     * Display supplier debts
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $outletId = auth()->user()->outlet_id ?? $request->input('outlet_id');

        $debts = SupplierDebt::with(['supplier', 'outlet'])
            ->when($outletId, function ($query) use ($outletId) {
                $query->where('outlet_id', $outletId);
            })
            ->when($search, function ($query) use ($search) {
                $query->whereHas('supplier', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                })->orWhere('invoice_number', 'like', '%' . $search . '%');
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get();

        return Inertia::render('Debt/SupplierDebts', [
            'debts' => $debts,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'outlet_id' => $outletId
            ]
        ]);
    }

    /**
     * Store new supplier debt
     */
    public function store(Request $request)
    {
        \Log::info('Storing new supplier debt', $request->all());
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'outlet_id' => 'required|exists:outlets,id',
            'purchase_order_id' => 'nullable|exists:purchase_orders,id',
            'invoice_number' => 'required|string|unique:supplier_debts',
            'total_amount' => 'required|numeric|min:0',
            'due_date' => 'required|date|after:today',
            'notes' => 'nullable|string',
        ]);

        $validated['remaining_amount'] = $validated['total_amount'];

        SupplierDebt::create($validated);

        return redirect()->back()
            ->with('success', 'Supplier debt created successfully.');
    }

    /**
     * Record payment for supplier debt
     */
    public function recordPayment(Request $request, SupplierDebt $debt)
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
            'debt_type' => 'supplier',
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

        $overdueDebts = SupplierDebt::with(['supplier', 'outlet'])
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
    public function update(Request $request, SupplierDebt $debt)
    {
        $validated = $request->validate([
            'due_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $debt->update($validated);
        $debt->updateStatus();

        return redirect()->back()
            ->with('success', 'Supplier debt updated successfully.');
    }

    /**
     * Delete debt
     */
    public function destroy(SupplierDebt $debt)
    {
        if ($debt->paid_amount > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete debt with payments.');
        }

        $debt->delete();

        return redirect()->back()
            ->with('success', 'Supplier debt deleted successfully.');
    }
}
