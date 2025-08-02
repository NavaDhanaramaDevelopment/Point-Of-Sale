<?php
namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\PendingSale;
use App\Models\Product;
use App\Models\Refund;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        return Inertia::render('Pos/Index');
    }

    public function scanBarcode(Request $request)
    {
        $barcode = $request->barcode;
        $product = Product::where('barcode', $barcode)->first();
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'grand_total' => 'required|numeric',
            'payment_method' => 'required|string',
            'payment_details' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'customer_contact' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $sale = Sale::create([
                'user_id' => Auth::id(),
                'customer_name' => $data['customer_name'] ?? null,
                'customer_contact' => $data['customer_contact'] ?? null,
                'total' => $data['total'],
                'discount' => $data['discount'] ?? 0,
                'tax' => $data['tax'] ?? 0,
                'grand_total' => $data['grand_total'],
                'payment_method' => $data['payment_method'],
                'payment_details' => $data['payment_details'] ?? null,
                'status' => 'paid',
            ]);

            foreach ($data['items'] as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'barcode' => $item['barcode'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);
                // Update stock
                Product::where('id', $item['product_id'])->decrement('stock', $item['quantity']);
            }
            DB::commit();
            return response()->json(['success' => true, 'sale_id' => $sale->id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function holdCart(Request $request)
    {
        $data = $request->validate([
            'cart_data' => 'required|json',
            'note' => 'nullable|string',
        ]);
        $pending = PendingSale::create([
            'user_id' => Auth::id(),
            'cart_data' => $data['cart_data'],
            'note' => $data['note'] ?? null,
        ]);
        return response()->json(['success' => true, 'pending_id' => $pending->id]);
    }

    public function refund(Request $request)
    {
        $data = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'amount' => 'required|numeric',
            'reason' => 'nullable|string',
        ]);
        $refund = Refund::create([
            'sale_id' => $data['sale_id'],
            'user_id' => Auth::id(),
            'amount' => $data['amount'],
            'reason' => $data['reason'] ?? null,
            'status' => 'pending',
        ]);
        return response()->json(['success' => true, 'refund_id' => $refund->id]);
    }
}
