<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use DB;

class StockController extends Controller
{
    public function index(): Response
    {
        $stockMovements = StockMovement::with(['product', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Stock/Index', [
            'stockMovements' => $stockMovements
        ]);
    }

    public function stockIn(): Response
    {
        $products = Product::select('id', 'name', 'purchase_price')
            ->with('stockMovements')
            ->get()
            ->map(function ($product) {
                $product->stock_quantity = $product->getActualStock();
                return $product;
            });

        return Inertia::render('Stock/StockIn', [
            'products' => $products
        ]);
    }

    public function storeStockIn(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string'
        ]);

        $product = Product::findOrFail($request->product_id);

        // Ambil stock terkini dari perhitungan movement
        $beforeStock = $product->getActualStock();
        $afterStock = $beforeStock + $request->quantity;

        // Update stock produk
        $product->update(['stock_quantity' => $afterStock]);

        // Catat pergerakan stock
        StockMovement::create([
            'product_id' => $request->product_id,
            'type' => 'in',
            'quantity' => $request->quantity,
            'quantity_before' => $beforeStock,
            'quantity_after' => $afterStock,
            'notes' => $request->notes,
            'reference_type' => 'purchase',
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('stock.index')->with('success', 'Stock berhasil ditambahkan');
    }

    public function stockOut(): Response
    {
        $products = Product::select('id', 'name', 'selling_price')
            ->with('stockMovements')
            ->get()
            ->map(function ($product) {
                $product->stock_quantity = $product->getActualStock();
                return $product;
            })
            ->filter(function ($product) {
                // Hanya tampilkan produk yang stock_quantity > 0
                return $product->stock_quantity > 0;
            })
            ->values();

        return Inertia::render('Stock/StockOut', [
            'products' => $products
        ]);
    }

    public function storeStockOut(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'required|string',
            'reason' => 'required|in:damaged,expired,lost,other'
        ]);

        $product = Product::findOrFail($request->product_id);

        // Ambil stock terkini dari perhitungan movement
        $beforeStock = $product->getActualStock();

        if ($beforeStock < $request->quantity) {
            return back()->withErrors(['quantity' => 'Stock tidak mencukupi']);
        }

        $afterStock = $beforeStock - $request->quantity;

        // Update stock produk
        $product->update(['stock_quantity' => $afterStock]);

        // Catat pergerakan stock
        StockMovement::create([
            'product_id' => $request->product_id,
            'type' => 'out',
            'quantity' => $request->quantity,
            'quantity_before' => $beforeStock,
            'quantity_after' => $afterStock,
            'notes' => $request->notes . ' (Alasan: ' . $request->reason . ')',
            'reference_type' => 'adjustment',
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('stock.index')->with('success', 'Stock berhasil dikurangi');
    }

    public function adjustment(): Response
    {
        $products = Product::select('id', 'name')
            ->with('stockMovements')
            ->get()
            ->map(function ($product) {
                $product->stock_quantity = $product->getActualStock();
                return $product;
            });

        return Inertia::render('Stock/Adjustment', [
            'products' => $products
        ]);
    }

    public function storeAdjustment(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'new_stock' => 'required|integer|min:0',
            'notes' => 'required|string'
        ]);

        $product = Product::findOrFail($request->product_id);

        // Ambil stock terkini dari perhitungan movement
        $beforeStock = $product->getActualStock();
        $afterStock = $request->new_stock;
        $difference = $afterStock - $beforeStock;

        if ($difference == 0) {
            return back()->withErrors(['new_stock' => 'Stock baru sama dengan stock saat ini']);
        }

        // Update stock produk
        $product->update(['stock_quantity' => $afterStock]);

        // Catat pergerakan stock
        StockMovement::create([
            'product_id' => $request->product_id,
            'type' => 'adjustment',
            'quantity' => abs($difference),
            'quantity_before' => $beforeStock,
            'quantity_after' => $afterStock,
            'notes' => $request->notes . ' (Penyesuaian: ' . ($difference > 0 ? '+' : '') . $difference . ')',
            'reference_type' => 'adjustment',
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('stock.index')->with('success', 'Stock berhasil disesuaikan');
    }

    public function report(Request $request): Response
    {
        $products = Product::select('id', 'name')->get();

        $query = StockMovement::with(['product', 'user']);

        if ($request->product_id) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        $movements = $query->orderBy('created_at', 'desc')->get();

        $summary = [
            'total_in' => $movements->where('type', 'in')->sum('quantity'),
            'total_out' => $movements->where('type', 'out')->sum('quantity'),
            'total_adjustments' => $movements->where('type', 'adjustment')->count(),
            'total_transfers' => $movements->where('type', 'transfer')->count()
        ];

        return Inertia::render('Stock/Report', [
            'products' => $products,
            'movements' => $movements,
            'summary' => $summary,
            'filters' => [
                'product_id' => $request->product_id,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]
        ]);
    }
}
