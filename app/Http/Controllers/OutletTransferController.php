<?php

namespace App\Http\Controllers;

use App\Models\OutletTransfer;
use App\Models\OutletTransferItem;
use App\Models\Outlet;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OutletTransferController extends Controller
{
    /**
     * Display transfers
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $outletId = auth()->user()->outlet_id;

        $transfers = OutletTransfer::with(['fromOutlet', 'toOutlet', 'creator', 'items'])
            ->when($outletId, function ($query) use ($outletId) {
                $query->where('from_outlet_id', $outletId)
                    ->orWhere('to_outlet_id', $outletId);
            })
            ->when($search, function ($query) use ($search) {
                $query->where('transfer_number', 'like', '%' . $search . '%')
                    ->orWhereHas('fromOutlet', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%');
                    })
                    ->orWhereHas('toOutlet', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%');
                    });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get();

        return Inertia::render('Transfer/OutletTransfers', [
            'transfers' => $transfers,
            'filters' => [
                'search' => $search,
                'status' => $status
            ]
        ]);
    }

    /**
     * Show create transfer form
     */
    public function create()
    {
        $outlets = Outlet::where('is_active', true)->get();
        $products = Product::with(['category', 'subcategory'])->get();

        return Inertia::render('Transfer/CreateTransfer', [
            'outlets' => $outlets,
            'products' => $products
        ]);
    }

    /**
     * Store new transfer
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_outlet_id' => 'required|exists:outlets,id',
            'to_outlet_id' => 'required|exists:outlets,id|different:from_outlet_id',
            'transfer_date' => 'required|date',
            'expected_arrival_date' => 'nullable|date|after:transfer_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity_requested' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        $transfer = OutletTransfer::create([
            'transfer_number' => OutletTransfer::generateTransferNumber(),
            'from_outlet_id' => $validated['from_outlet_id'],
            'to_outlet_id' => $validated['to_outlet_id'],
            'transfer_date' => $validated['transfer_date'],
            'expected_arrival_date' => $validated['expected_arrival_date'],
            'notes' => $validated['notes'],
            'created_by' => auth()->id(),
        ]);

        foreach ($validated['items'] as $item) {
            OutletTransferItem::create([
                'outlet_transfer_id' => $transfer->id,
                'product_id' => $item['product_id'],
                'quantity_requested' => $item['quantity_requested'],
                'quantity_sent' => $item['quantity_requested'], // Initially same as requested
                'unit_cost' => $item['unit_cost'],
                'total_cost' => $item['unit_cost'] * $item['quantity_requested'],
            ]);
        }

        return redirect()->route('transfers.index')
            ->with('success', 'Transfer created successfully.');
    }

    /**
     * Show transfer details
     */
    public function show(OutletTransfer $transfer)
    {
        $transfer->load(['fromOutlet', 'toOutlet', 'creator', 'receiver', 'items.product']);

        return Inertia::render('Transfer/TransferDetails', [
            'transfer' => $transfer
        ]);
    }

    /**
     * Show edit transfer form
     */
    public function edit(OutletTransfer $transfer)
    {
        if ($transfer->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Can only edit pending transfers.');
        }

        $transfer->load(['fromOutlet', 'toOutlet', 'items.product']);
        $outlets = Outlet::where('is_active', true)->get();
        $products = Product::with(['category', 'subcategory'])->get();

        return Inertia::render('Transfer/EditTransfer', [
            'transfer' => $transfer,
            'outlets' => $outlets,
            'products' => $products
        ]);
    }

    /**
     * Update transfer
     */
    public function update(Request $request, OutletTransfer $transfer)
    {
        if ($transfer->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Can only edit pending transfers.');
        }

        $validated = $request->validate([
            'from_outlet_id' => 'required|exists:outlets,id',
            'to_outlet_id' => 'required|exists:outlets,id|different:from_outlet_id',
            'transfer_date' => 'required|date',
            'expected_arrival_date' => 'nullable|date|after:transfer_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity_requested' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        $transfer->update([
            'from_outlet_id' => $validated['from_outlet_id'],
            'to_outlet_id' => $validated['to_outlet_id'],
            'transfer_date' => $validated['transfer_date'],
            'expected_arrival_date' => $validated['expected_arrival_date'],
            'notes' => $validated['notes'],
        ]);

        // Delete existing items and recreate them
        $transfer->items()->delete();

        foreach ($validated['items'] as $item) {
            OutletTransferItem::create([
                'outlet_transfer_id' => $transfer->id,
                'product_id' => $item['product_id'],
                'quantity_requested' => $item['quantity_requested'],
                'quantity_sent' => $item['quantity_requested'], // Initially same as requested
                'unit_cost' => $item['unit_cost'],
                'total_cost' => $item['unit_cost'] * $item['quantity_requested'],
            ]);
        }

        return redirect()->route('transfers.index')
            ->with('success', 'Transfer updated successfully.');
    }

    /**
     * Delete transfer
     */
    public function destroy(OutletTransfer $transfer)
    {
        if ($transfer->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Can only delete pending transfers.');
        }

        $transfer->items()->delete();
        $transfer->delete();

        return redirect()->route('transfers.index')
            ->with('success', 'Transfer deleted successfully.');
    }

    /**
     * Update transfer status
     */
    public function updateStatus(Request $request, OutletTransfer $transfer)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_transit,received,cancelled',
            'received_date' => 'required_if:status,received|date',
            'items' => 'required_if:status,received|array',
            'items.*.id' => 'required_if:status,received|exists:outlet_transfer_items,id',
            'items.*.quantity_received' => 'required_if:status,received|integer|min:0',
        ]);

        $transfer->update([
            'status' => $validated['status'],
            'received_date' => $validated['received_date'] ?? null,
            'received_by' => $validated['status'] === 'received' ? auth()->id() : null,
        ]);

        if ($validated['status'] === 'received' && isset($validated['items'])) {
            foreach ($validated['items'] as $itemData) {
                $item = OutletTransferItem::find($itemData['id']);
                if ($item) {
                    $item->update([
                        'quantity_received' => $itemData['quantity_received']
                    ]);
                }
            }
        }

        return redirect()->back()
            ->with('success', 'Transfer status updated successfully.');
    }

    /**
     * Cancel transfer
     */
    public function cancel(OutletTransfer $transfer)
    {
        if ($transfer->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Can only cancel pending transfers.');
        }

        $transfer->update(['status' => 'cancelled']);

        return redirect()->back()
            ->with('success', 'Transfer cancelled successfully.');
    }
}
