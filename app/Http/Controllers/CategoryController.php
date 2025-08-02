<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('subcategories')->get();
        return Inertia::render('Category/Index', compact('categories'));
    }

    public function create()
    {
        return Inertia::render('Category/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Category::create($data);
        return redirect()->route('subscription.category.index');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Category/Edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $category->update($data);
        return redirect()->route('subscription.category.index');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('subscription.category.index');
    }
}
