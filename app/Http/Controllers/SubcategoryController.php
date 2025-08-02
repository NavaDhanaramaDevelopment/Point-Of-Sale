<?php
namespace App\Http\Controllers;

use App\Models\Subcategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubcategoryController extends Controller
{
    public function index()
    {
        $subcategories = Subcategory::with('category')->get();
        return Inertia::render('Subcategory/Index', compact('subcategories'));
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Subcategory/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);
        Subcategory::create($data);
        return redirect()->route('subscription.subcategory.index');
    }

    public function edit(Subcategory $subcategory)
    {
        $categories = Category::all();
        return Inertia::render('Subcategory/Edit', compact('subcategory', 'categories'));
    }

    public function update(Request $request, Subcategory $subcategory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);
        $subcategory->update($data);
        return redirect()->route('subscription.subcategory.index');
    }

    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();
        return redirect()->route('subscription.subcategory.index');
    }
}
