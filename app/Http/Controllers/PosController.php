<?php
namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\PendingSale;
use App\Models\Product;
use App\Models\Refund;
use App\Models\StockMovement;
use App\Models\Customer;
use App\Models\Outlet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $outlets = collect();

        // If user is manager, they can select any outlet
        if ($user->isManager()) {
            $outlets = Outlet::where('super_admin_id', $user->super_admin_id)->get();
        }

        return Inertia::render('Pos/Index', [
            'outlets' => $outlets,
            'userRole' => $user->role,
            'userOutletId' => $user->outlet_id
        ]);
    }

    public function scanBarcode(Request $request)
    {
        $barcode = $request->barcode;
        $outletId = $request->outlet_id; // Get outlet from request for managers

        $product = Product::where('barcode', $barcode)
            ->where('is_active', true);

        // Filter by outlet - use selected outlet for managers, user outlet for others
        $user = Auth::user();
        $targetOutletId = $user->isManager() ? $outletId : $user->outlet_id;

        if ($targetOutletId) {
            $product = $product->where('outlet_id', $targetOutletId);
        }

        $product = $product->first();

        // If not found by barcode, try searching by name
        if (!$product) {
            $product = Product::where('name', 'LIKE', '%' . $barcode . '%')
                ->where('is_active', true);

            if ($targetOutletId) {
                $product = $product->where('outlet_id', $targetOutletId);
            }

            $product = $product->first();
        }

        if ($product) {
            // Add actual stock to the response
            $product->actual_stock = $product->getActualStock();
        }else{
            $product = [];
        }

        return response()->json($product);
    }

    public function searchCustomers(Request $request)
    {
        $search = $request->search;
        $outletId = $request->outlet_id;

        // For non-managers, use user's outlet_id; for managers, use selected outlet
        $user = Auth::user();
        $targetOutletId = $user->isManager() ? $outletId : $user->outlet_id;

        $customers = Customer::where('outlet_id', $targetOutletId)
            ->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get();

        return response()->json($customers);
    }

    public function findOrCreateCustomer(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'outlet_id' => 'nullable|exists:outlets,id'
        ]);

        $user = Auth::user();
        $outletId = $user->isManager() ? $request->outlet_id : $user->outlet_id;

        if (!$outletId) {
            return response()->json(['success' => false, 'message' => 'Outlet tidak ditemukan'], 400);
        }

        // Search for existing customer by phone in the same outlet
        $customer = Customer::where('phone', $request->phone)
            ->where('outlet_id', $outletId)
            ->first();

        if ($customer) {
            // Update existing customer info if needed
            $customer->update([
                'name' => $request->name,
                'last_visit' => now()
            ]);
        } else {
            // Create new customer
            $customer = Customer::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'outlet_id' => $outletId,
                'points' => 0,
                'total_spent' => 0,
                'visit_count' => 0,
                'last_visit' => now(),
                'discount_percentage' => 0,
                'is_active' => true
            ]);
        }

        return response()->json($customer);
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
            'note' => 'nullable|string',
            'customer_id' => 'nullable|exists:customers,id',
            'customer_name' => 'nullable|string',
            'customer_phone' => 'nullable|string',
            'outlet_id' => 'nullable|exists:outlets,id'
        ]);

        DB::beginTransaction();
        try {
            // Determine outlet ID based on user role
            $user = Auth::user();
            $outletId = $user->isManager() ? ($data['outlet_id'] ?? null) : $user->outlet_id;

            if (!$outletId) {
                return response()->json(['success' => false, 'message' => 'Outlet harus dipilih'], 400);
            }

            // Handle customer creation/update if phone provided
            $customerId = $data['customer_id'] ?? null;

            if (!$customerId && $data['customer_name'] && $data['customer_phone']) {
                // Find or create customer
                $customer = Customer::where('phone', $data['customer_phone'])
                    ->where('outlet_id', $outletId)
                    ->first();

                if ($customer) {
                    // Update existing customer
                    $customer->update([
                        'name' => $data['customer_name'],
                        'last_visit' => now()
                    ]);
                } else {
                    // Create new customer
                    $customer = Customer::create([
                        'name' => $data['customer_name'],
                        'phone' => $data['customer_phone'],
                        'outlet_id' => $outletId,
                        'points' => 0,
                        'total_spent' => 0,
                        'visit_count' => 0,
                        'last_visit' => now(),
                        'discount_percentage' => 0,
                        'is_active' => true
                    ]);
                }

                $customerId = $customer->id;
            }

            $sale = Sale::create([
                'user_id' => Auth::id(),
                'outlet_id' => $outletId,
                'customer_id' => $customerId,
                'customer_name' => $data['customer_name'] ?? null,
                'customer_contact' => $data['customer_phone'] ?? null,
                'total' => $data['total'],
                'discount' => $data['discount'] ?? 0,
                'tax' => $data['tax'] ?? 0,
                'grand_total' => $data['grand_total'],
                'payment_method' => $data['payment_method'],
                'note' => $data['note'] ?? null,
                'status' => 'paid',
            ]);

            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'price' => $item['price'],
                    'unit' => $product->unit,
                    'qty' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);

                // Create stock movement with before/after quantities
                if ($product) {
                    $quantityBefore = $product->getActualStock();
                    $quantityAfter = $quantityBefore - $item['quantity'];

                    StockMovement::create([
                        'product_id' => $item['product_id'],
                        'type' => 'out',
                        'quantity' => $item['quantity'],
                        'quantity_before' => $quantityBefore,
                        'quantity_after' => $quantityAfter,
                        'reference_type' => 'sale',
                        'reference_id' => $sale->id,
                        'outlet_from' => $outletId,
                        'outlet_to' => $outletId,
                        'notes' => 'Penjualan - Invoice: ' . $sale->invoice,
                        'user_id' => Auth::id(),
                    ]);
                }
            }

            // Update customer statistics if customer exists
            if ($customerId) {
                $customer = Customer::find($customerId);
                if ($customer) {
                    $customer->updateAfterPurchase($data['grand_total']);

                    // Calculate and add loyalty points (example: 1 point per 1000 spent)
                    $pointsEarned = floor($data['grand_total'] / 1000);
                    if ($pointsEarned > 0) {
                        $customer->addPoints($pointsEarned, 'Pembelian - Invoice: ' . $sale->invoice, 'sale', $sale->id);
                    }
                }
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
