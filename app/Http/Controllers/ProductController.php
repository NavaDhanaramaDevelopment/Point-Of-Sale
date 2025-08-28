<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Outlet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;

        $products = Product::with(['category', 'subcategory', 'outlet'])
            ->where('super_admin_id', $superAdminId)
            ->when($request->search, function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('sku', 'like', '%'.$request->search.'%')
                  ->orWhere('barcode', 'like', '%'.$request->search.'%');
            })
            ->orderBy('name')
            ->paginate(20);
        $categories = Category::all();
        return Inertia::render('Product/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only('search', 'category_id')
        ]);
    }

    public function create()
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;
            
        $categories = Category::with('subcategories')->get();
        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Product/Create', [
            'categories' => $categories,
            'outlets' => $outlets
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'outlet_id' => 'required|exists:outlets,id',
            'category_id' => 'nullable|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'sku' => 'required|unique:products,sku',
            'barcode' => 'nullable|unique:products,barcode',
            'unit' => 'required',
            'purchase_price' => 'required|numeric',
            'selling_price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'minimum_stock' => 'required|integer',
            'image' => 'nullable|image|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $user = auth()->user();
        $data['super_admin_id'] = $user->role === 'manager' ? $user->id : $user->super_admin_id;

        Product::create($data);
        return redirect()->route('product.index')->with('success', 'Produk berhasil ditambahkan');
    }

    public function edit(Product $product)
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;
            
        $categories = Category::with('subcategories')->get();
        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Product/Edit', [
            'product' => $product,
            'categories' => $categories,
            'outlets' => $outlets
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'category_id' => 'nullable|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'sku' => 'required|unique:products,sku,'.$product->id,
            'barcode' => 'nullable|unique:products,barcode,'.$product->id,
            'unit' => 'required',
            'purchase_price' => 'required|numeric',
            'selling_price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'minimum_stock' => 'required|integer',
            'image' => 'nullable|image|max:2048',
        ]);
        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }
        $product->update($data);
        return redirect()->route('product.index')->with('success', 'Produk berhasil diupdate');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('product.index')->with('success', 'Produk dihapus');
    }
}
