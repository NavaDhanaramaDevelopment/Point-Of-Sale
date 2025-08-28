<?php
namespace App\Http\Controllers;

use App\Models\Subcategory;
use App\Models\Category;
use App\Models\Outlet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubcategoryController extends Controller
{
    public function index()
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;

        $subcategories = Subcategory::with('category', 'outlet')
            ->where('super_admin_id', $superAdminId)
            ->get();

        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Subcategory/Index', [
            'subcategories' => $subcategories,
            'outlets' => $outlets
        ]);
    }

    public function create()
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;

        $categories = Category::where('super_admin_id', $superAdminId)->get();
        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Subcategory/Create', [
            'categories' => $categories,
            'outlets' => $outlets
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'outlet_id' => 'required|exists:outlets,id',
        ]);

        $user = auth()->user();
        $data['super_admin_id'] = $user->role === 'manager' ? $user->id : $user->super_admin_id;

        Subcategory::create($data);
        return redirect()->route('subcategory.index');
    }

    public function edit(Subcategory $subcategory)
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;

        $categories = Category::where('super_admin_id', $superAdminId)->get();
        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Subcategory/Edit', [
            'subcategory' => $subcategory,
            'categories' => $categories,
            'outlets' => $outlets
        ]);
    }

    public function update(Request $request, Subcategory $subcategory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'outlet_id' => 'required|exists:outlets,id',
        ]);
        
        $user = auth()->user();
        if (!$subcategory->super_admin_id) {
            $data['super_admin_id'] = $user->role === 'manager' ? $user->id : $user->super_admin_id;
        }
        
        $subcategory->update($data);
        return redirect()->route('subcategory.index');
    }

    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();
        return redirect()->route('subcategory.index');
    }
}
