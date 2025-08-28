<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Outlet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        $supplier = $request->input('supplier');

        $purchaseOrders = PurchaseOrder::query()
            ->with(['supplier', 'user', 'outlet'])
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($supplier, function ($query) use ($supplier) {
                $query->where('supplier_id', $supplier);
            })
            ->latest()
            ->paginate(15);

        $suppliers = Supplier::active()->get(['id', 'name']);

        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return Inertia::render('Manager/PurchaseOrders/Index', [
                'purchaseOrders' => $purchaseOrders,
                'suppliers' => $suppliers,
                'filters' => [
                    'status' => $status,
                    'supplier' => $supplier,
                ]
            ]);
        }

        return Inertia::render('PurchaseOrder/Index', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => $suppliers,
            'filters' => [
                'status' => $status,
                'supplier' => $supplier,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;
        $outlets = Outlet::where('super_admin_id', $superAdminId)
                    ->where('is_active', true)
                    ->get();
        $suppliers = Supplier::active()->get(['id', 'name', 'company']);
        $products = Product::active()->get(['id', 'name', 'stock_quantity', 'purchase_price']);

        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return Inertia::render('Manager/PurchaseOrders/Create', [
                'suppliers' => $suppliers,
                'products' => $products,
                'outlets' => $outlets,
                'poNumber' => PurchaseOrder::generatePoNumber()
            ]);
        }

        return Inertia::render('PurchaseOrder/Create', [
            'suppliers' => $suppliers,
            'products' => $products,
            'poNumber' => PurchaseOrder::generatePoNumber()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_date' => 'nullable|date|after_or_equal:order_date',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity_ordered' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string'
        ]);
        $validated['outlet_id'] = $request->outlet_id;

        DB::transaction(function() use ($validated) {
            $purchaseOrder = PurchaseOrder::create([
                'po_number' => PurchaseOrder::generatePoNumber(),
                'outlet_id' => $validated['outlet_id'],
                'supplier_id' => $validated['supplier_id'],
                'user_id' => auth()->id(),
                'order_date' => $validated['order_date'],
                'expected_date' => $validated['expected_date'] ?? null,
                'tax_amount' => $validated['tax_amount'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'notes' => $validated['notes'] ?? null,
                'status' => 'draft'
            ]);

            foreach ($validated['items'] as $item) {
                $totalCost = $item['quantity_ordered'] * $item['unit_cost'];

                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'product_id' => $item['product_id'],
                    'quantity_ordered' => $item['quantity_ordered'],
                    'unit_cost' => $item['unit_cost'],
                    'total_cost' => $totalCost,
                    'notes' => $item['notes'] ?? null
                ]);
            }

            // Calculate totals
            $purchaseOrder->calculateTotals();
        });

        // Determine redirect route based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return redirect()->route('manager.purchase-orders.index')
                ->with('success', 'Purchase Order created successfully.');
        }

        return redirect()->route('purchase-orders.index')
            ->with('success', 'Purchase Order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'user', 'items.product']);

        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return Inertia::render('Manager/PurchaseOrders/Show', [
                'purchaseOrder' => $purchaseOrder
            ]);
        }

        return Inertia::render('PurchaseOrder/Show', [
            'purchaseOrder' => $purchaseOrder
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Only allow editing if status is draft
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Can only edit draft purchase orders.');
        }

        $purchaseOrder->load(['items.product']);
        $suppliers = Supplier::active()->get(['id', 'name', 'company']);
        $products = Product::active()->get(['id', 'name', 'sku', 'stock', 'price']);

        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return Inertia::render('Manager/PurchaseOrders/Edit', [
                'purchaseOrder' => $purchaseOrder,
                'suppliers' => $suppliers,
                'products' => $products
            ]);
        }

        return Inertia::render('PurchaseOrder/Edit', [
            'purchaseOrder' => $purchaseOrder,
            'suppliers' => $suppliers,
            'products' => $products
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Check permission
        if (!auth()->user()->hasPermission('edit_purchase_orders')) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow editing if status is draft
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Can only edit draft purchase orders.');
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_date' => 'nullable|date|after_or_equal:order_date',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity_ordered' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string'
        ]);
        $validated['outlet_id'] = $request->outlet_id;

        DB::transaction(function() use ($validated, $purchaseOrder) {
            $purchaseOrder->update([
                'outlet_id' => $validated['outlet_id'],
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'expected_date' => $validated['expected_date'] ?? null,
                'tax_amount' => $validated['tax_amount'] ?? 0,
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'notes' => $validated['notes'] ?? null
            ]);

            // Delete existing items
            $purchaseOrder->items()->delete();

            // Create new items
            foreach ($validated['items'] as $item) {
                $totalCost = $item['quantity_ordered'] * $item['unit_cost'];

                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'product_id' => $item['product_id'],
                    'quantity_ordered' => $item['quantity_ordered'],
                    'unit_cost' => $item['unit_cost'],
                    'total_cost' => $totalCost,
                    'notes' => $item['notes'] ?? null
                ]);
            }

            // Calculate totals
            $purchaseOrder->calculateTotals();
        });

        // Determine redirect route based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return redirect()->route('manager.purchase-orders.index')
                ->with('success', 'Purchase Order updated successfully.');
        }

        return redirect()->route('purchase-orders.index')
            ->with('success', 'Purchase Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Only allow deletion if status is draft
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Can only delete draft purchase orders.');
        }

        $purchaseOrder->delete();

        // Determine redirect route based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'manager.')) {
            return redirect()->route('manager.purchase-orders.index')
                ->with('success', 'Purchase Order deleted successfully.');
        }

        return redirect()->route('purchase-orders.index')
            ->with('success', 'Purchase Order deleted successfully.');
    }

    /**
     * Pending purchase order
     */
    public function pending(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Can only pending pending purchase orders.');
        }

        $purchaseOrder->update(['status' => 'pending']);

        return redirect()->back()
            ->with('success', 'Purchase Order pending successfully.');
    }

    /**
     * Approve purchase order
     */
    public function approve(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Can only approve pending purchase orders.');
        }

        $purchaseOrder->update(['status' => 'approved']);

        return redirect()->back()
            ->with('success', 'Purchase Order approved successfully.');
    }

    /**
     * Submit purchase order for approval
     */
    public function submit(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Can only submit draft purchase orders.');
        }

        $purchaseOrder->update(['status' => 'pending']);

        return redirect()->back()
            ->with('success', 'Purchase Order submitted for approval.');
    }

    /**
     * Receive purchase order items
     */
    /**
     * Display the purchase order for printing
     */
    public function print(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'outlet', 'user', 'items.product']);
        return Inertia::render('PurchaseOrder/Print', [
            'purchaseOrder' => $purchaseOrder
        ]);
    }

    public function receive(Request $request, PurchaseOrder $purchaseOrder)
    {
        // // Check permission
        // if (!auth()->user()->hasPermission('receive_purchase_orders')) {
        //     abort(403, 'Unauthorized action.');
        // }

        if ($purchaseOrder->status !== 'ordered') {
            return redirect()->back()
                ->with('error', 'Can only receive approved purchase orders.');
        }


        DB::transaction(function() use ( $purchaseOrder) {
            foreach ($purchaseOrder->purchaseOrderItem as $itemData) {
                // Update product stock
                $product = $itemData->product;
                $product->increment('stock_quantity', $itemData->quantity_received);
            }

            $purchaseOrder->update([
                'status' => 'received',
                'received_date' => now()
            ]);
        });

        return redirect()->back()
            ->with('success', 'Items received successfully.');
    }

    /**
     * Canceled purchase order
     */
    public function cencelled(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'cancelled') {
            return redirect()->back()
                ->with('error', 'Can only cencelled purchase orders.');
        }

        $purchaseOrder->update(['status' => 'cencelled']);

        return redirect()->back()
            ->with('success', 'Purchase Order cencelled successfully.');
    }

    /**
     * Ordered purchase order
     */
    public function ordered(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'approved') {
            return redirect()->back()
                ->with('error', 'Can only ordered purchase orders.');
        }

        $purchaseOrder->update(['status' => 'ordered']);

        return redirect()->back()
            ->with('success', 'Purchase Order ordered successfully.');
    }
}
