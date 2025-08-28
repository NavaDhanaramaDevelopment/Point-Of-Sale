<?php
namespace App\Http\Controllers;

use App\Models\Outlet;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;

        $categories = Category::with('outlet')
            ->where('super_admin_id', $superAdminId)
            ->get();

        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Category/Index', [
            'categories' => $categories,
            'outlets' => $outlets
        ]);
    }

    public function create()
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;

        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Category/Create', [
            'outlets' => $outlets
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'outlet_id' => 'required|exists:outlets,id',
        ]);

        $user = auth()->user();
        $data['super_admin_id'] = $user->role === 'manager' ? $user->id : $user->super_admin_id;
        
        Category::create($data);
        return redirect()->route('category.index');
    }

    public function edit(Category $category)
    {
        $superAdminId = auth()->user()->role === 'manager' 
            ? auth()->id() 
            : auth()->user()->super_admin_id;

        $outlets = Outlet::where('super_admin_id', $superAdminId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Category/Edit', [
            'category' => $category,
            'outlets' => $outlets
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $category->update($data);
        return redirect()->route('category.index');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('category.index');
    }
}
