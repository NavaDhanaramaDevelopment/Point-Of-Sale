<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Permission;
use App\Models\RolePermission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Check permission
        if (!auth()->user()->hasPermission('view_users') && !auth()->user()->isOwner()) {
            abort(403, 'Unauthorized action.');
        }

        $search = $request->input('search');
        $role = $request->input('role');

        $users = User::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->when($role, function ($query) use ($role) {
                $query->where('role', $role);
            })
            ->latest()
            ->get(); // Changed from paginate to get for simpler handling

        // Determine which view to render based on current route
        $routeName = $request->route()->getName();

        if (str_starts_with($routeName, 'owner.')) {
            return Inertia::render('Owner/Users', [
                'users' => $users,
                'filters' => [
                    'search' => $search,
                    'role' => $role,
                ]
            ]);
        }

        return Inertia::render('User/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check permission
        if (!auth()->user()->hasPermission('create_users')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check permission
        if (!auth()->user()->hasPermission('create_users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:owner,admin,manager,kasir',
            'is_active' => 'boolean'
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Check permission
        if (!auth()->user()->hasPermission('view_users')) {
            abort(403, 'Unauthorized action.');
        }

        $user->load(['sales' => function($query) {
            $query->latest()->take(10);
        }, 'shifts' => function($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('User/Show', [
            'user' => $user,
            'permissions' => $user->getPermissions()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Check permission
        if (!auth()->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('User/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Check permission
        if (!auth()->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:owner,admin,manager,kasir',
            'is_active' => 'boolean'
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? $user->is_active
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Check permission
        if (!auth()->user()->hasPermission('delete_users')) {
            abort(403, 'Unauthorized action.');
        }

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'Cannot delete your own account.');
        }

        // Check if user has sales or shifts
        if ($user->sales()->count() > 0 || $user->shifts()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete user with existing sales or shifts.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Display role permissions management
     */
    public function permissions()
    {
        // Check permission - only owner can manage permissions
        if (!auth()->user()->hasPermission('manage_permissions')) {
            abort(403, 'Unauthorized action.');
        }

        $permissions = Permission::all()->groupBy('module');
        $rolePermissions = RolePermission::with('permission')->get()->groupBy('role');

        return Inertia::render('User/Permissions', [
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions
        ]);
    }

    /**
     * Update role permissions
     */
    public function updatePermissions(Request $request)
    {
        // Check permission - only owner can manage permissions
        if (!auth()->user()->hasPermission('manage_permissions')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'role' => 'required|in:owner,admin,manager,kasir',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        // Remove existing permissions for role
        RolePermission::where('role', $validated['role'])->delete();

        // Add new permissions
        foreach ($validated['permissions'] ?? [] as $permissionId) {
            RolePermission::create([
                'role' => $validated['role'],
                'permission_id' => $permissionId
            ]);
        }

        return redirect()->back()
            ->with('success', 'Role permissions updated successfully.');
    }

    /**
     * Display roles management
     */
    public function roleIndex()
    {
        // Check permission - only owner can manage roles
        if (!auth()->user()->isOwner()) {
            abort(403, 'Unauthorized action.');
        }

        $roles = ['owner', 'admin', 'manager', 'kasir'];
        $rolePermissions = RolePermission::with('permission')->get()->groupBy('role');

        return Inertia::render('Owner/Roles', [
            'roles' => $roles,
            'rolePermissions' => $rolePermissions
        ]);
    }

    /**
     * Display permissions management
     */
    public function permissionIndex()
    {
        // Check permission - only owner can manage permissions
        if (!auth()->user()->isOwner()) {
            abort(403, 'Unauthorized action.');
        }

        $permissions = Permission::all()->groupBy('module');
        $rolePermissions = RolePermission::with('permission')->get()->groupBy('role');

        return Inertia::render('Owner/Permissions', [
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions
        ]);
    }

    /**
     * Store a new permission
     */
    public function permissionStore(Request $request)
    {
        // Check permission - only owner can manage permissions
        if (!auth()->user()->isOwner()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'module' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        Permission::create($validated);

        return redirect()->back()
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Update a permission
     */
    public function permissionUpdate(Request $request, Permission $permission)
    {
        // Check permission - only owner can manage permissions
        if (!auth()->user()->isOwner()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'module' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $permission->update($validated);

        return redirect()->back()
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Delete a permission
     */
    public function permissionDestroy(Permission $permission)
    {
        // Check permission - only owner can manage permissions
        if (!auth()->user()->isOwner()) {
            abort(403, 'Unauthorized action.');
        }

        // Remove role permissions first
        RolePermission::where('permission_id', $permission->id)->delete();

        $permission->delete();

        return redirect()->back()
            ->with('success', 'Permission deleted successfully.');
    }

    /**
     * Store role permissions
     */
    public function roleStore(Request $request)
    {
        // This is for updating role permissions, not creating new roles
        // since roles are predefined
        return $this->updatePermissions($request);
    }

    /**
     * Update role permissions
     */
    public function roleUpdate(Request $request, $role)
    {
        // Check permission - only owner can manage roles
        if (!auth()->user()->isOwner()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        // Remove existing permissions for role
        RolePermission::where('role', $role)->delete();

        // Add new permissions
        foreach ($validated['permissions'] ?? [] as $permissionId) {
            RolePermission::create([
                'role' => $role,
                'permission_id' => $permissionId
            ]);
        }

        return redirect()->back()
            ->with('success', 'Role permissions updated successfully.');
    }

    /**
     * This method doesn't apply since roles are predefined
     */
    public function roleDestroy($role)
    {
        return redirect()->back()
            ->with('error', 'Cannot delete predefined roles.');
    }

    // Manager-specific methods

    /**
     * Display users for manager (admin and kasir only)
     */
    public function managerIndex(Request $request)
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $user = auth()->user();

        $users = User::query()
            ->whereIn('role', ['admin', 'kasir']) // Manager can only manage admin and kasir
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->when($role, function ($query) use ($role) {
                $query->where('role', $role);
            })
            ->with('outlet')
            ->latest()
            ->get();

        $outlets = \App\Models\Outlet::where('is_active', true)->get();

        return Inertia::render('Manager/Users/Index', [
            'users' => $users,
            'outlets' => $outlets,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ]
        ]);
    }

    /**
     * Show create form for manager
     */
    public function managerCreate()
    {
        $outlets = \App\Models\Outlet::where('is_active', true)->get();

        return Inertia::render('Manager/Users/Create', [
            'outlets' => $outlets
        ]);
    }

    /**
     * Store user for manager
     */
    public function managerStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,kasir', // Manager can only create admin and kasir
            'outlet_id' => 'required|exists:outlets,id',
            'is_active' => 'boolean'
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'outlet_id' => $validated['outlet_id'],
            'is_active' => $validated['is_active'] ?? true
        ]);

        return redirect()->route('manager.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show edit form for manager
     */
    public function managerEdit(User $user)
    {
        // Check if manager can edit this user (only admin and kasir)
        if (!in_array($user->role, ['admin', 'kasir'])) {
            abort(403, 'You can only edit admin and kasir users.');
        }

        $outlets = \App\Models\Outlet::where('is_active', true)->get();

        return Inertia::render('Manager/Users/Edit', [
            'user' => $user,
            'outlets' => $outlets
        ]);
    }

    /**
     * Update user for manager
     */
    public function managerUpdate(Request $request, User $user)
    {
        // Check if manager can edit this user (only admin and kasir)
        if (!in_array($user->role, ['admin', 'kasir'])) {
            abort(403, 'You can only edit admin and kasir users.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:admin,kasir',
            'outlet_id' => 'required|exists:outlets,id',
            'is_active' => 'boolean'
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'outlet_id' => $validated['outlet_id'],
            'is_active' => $validated['is_active'] ?? true
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('manager.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Delete user for manager
     */
    public function managerDestroy(User $user)
    {
        // Check if manager can delete this user (only admin and kasir)
        if (!in_array($user->role, ['admin', 'kasir'])) {
            abort(403, 'You can only delete admin and kasir users.');
        }

        // Prevent deleting self
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('manager.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
