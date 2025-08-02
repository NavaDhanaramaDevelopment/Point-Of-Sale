<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\RolePermission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permissions by module
        $permissions = [
            // Dashboard
            ['name' => 'view_dashboard', 'display_name' => 'View Dashboard', 'module' => 'dashboard'],

            // Products
            ['name' => 'view_products', 'display_name' => 'View Products', 'module' => 'products'],
            ['name' => 'create_products', 'display_name' => 'Create Products', 'module' => 'products'],
            ['name' => 'edit_products', 'display_name' => 'Edit Products', 'module' => 'products'],
            ['name' => 'delete_products', 'display_name' => 'Delete Products', 'module' => 'products'],

            // Categories
            ['name' => 'view_categories', 'display_name' => 'View Categories', 'module' => 'categories'],
            ['name' => 'create_categories', 'display_name' => 'Create Categories', 'module' => 'categories'],
            ['name' => 'edit_categories', 'display_name' => 'Edit Categories', 'module' => 'categories'],
            ['name' => 'delete_categories', 'display_name' => 'Delete Categories', 'module' => 'categories'],

            // Sales
            ['name' => 'view_sales', 'display_name' => 'View Sales', 'module' => 'sales'],
            ['name' => 'create_sales', 'display_name' => 'Create Sales', 'module' => 'sales'],
            ['name' => 'edit_sales', 'display_name' => 'Edit Sales', 'module' => 'sales'],
            ['name' => 'delete_sales', 'display_name' => 'Delete Sales', 'module' => 'sales'],

            // Users
            ['name' => 'view_users', 'display_name' => 'View Users', 'module' => 'users'],
            ['name' => 'create_users', 'display_name' => 'Create Users', 'module' => 'users'],
            ['name' => 'edit_users', 'display_name' => 'Edit Users', 'module' => 'users'],
            ['name' => 'delete_users', 'display_name' => 'Delete Users', 'module' => 'users'],

            // Suppliers
            ['name' => 'view_suppliers', 'display_name' => 'View Suppliers', 'module' => 'suppliers'],
            ['name' => 'create_suppliers', 'display_name' => 'Create Suppliers', 'module' => 'suppliers'],
            ['name' => 'edit_suppliers', 'display_name' => 'Edit Suppliers', 'module' => 'suppliers'],
            ['name' => 'delete_suppliers', 'display_name' => 'Delete Suppliers', 'module' => 'suppliers'],

            // Purchase Orders
            ['name' => 'view_purchase_orders', 'display_name' => 'View Purchase Orders', 'module' => 'purchase_orders'],
            ['name' => 'create_purchase_orders', 'display_name' => 'Create Purchase Orders', 'module' => 'purchase_orders'],
            ['name' => 'edit_purchase_orders', 'display_name' => 'Edit Purchase Orders', 'module' => 'purchase_orders'],
            ['name' => 'delete_purchase_orders', 'display_name' => 'Delete Purchase Orders', 'module' => 'purchase_orders'],
            ['name' => 'approve_purchase_orders', 'display_name' => 'Approve Purchase Orders', 'module' => 'purchase_orders'],
            ['name' => 'receive_purchase_orders', 'display_name' => 'Receive Purchase Orders', 'module' => 'purchase_orders'],

            // Reports
            ['name' => 'view_reports', 'display_name' => 'View Reports', 'module' => 'reports'],
            ['name' => 'view_analytics', 'display_name' => 'View Analytics', 'module' => 'reports'],

            // Shifts
            ['name' => 'view_shifts', 'display_name' => 'View Shifts', 'module' => 'shifts'],
            ['name' => 'create_shifts', 'display_name' => 'Create Shifts', 'module' => 'shifts'],
            ['name' => 'close_shifts', 'display_name' => 'Close Shifts', 'module' => 'shifts'],

            // Settings
            ['name' => 'view_settings', 'display_name' => 'View Settings', 'module' => 'settings'],
            ['name' => 'edit_settings', 'display_name' => 'Edit Settings', 'module' => 'settings'],

            // Role & Permission Management
            ['name' => 'manage_roles', 'display_name' => 'Manage Roles', 'module' => 'roles'],
            ['name' => 'manage_permissions', 'display_name' => 'Manage Permissions', 'module' => 'permissions'],
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }

        // Assign permissions to roles
        $rolePermissions = [
            'owner' => [
                // Owner has all permissions including role and permission management
                'view_dashboard', 'view_products', 'create_products', 'edit_products', 'delete_products',
                'view_categories', 'create_categories', 'edit_categories', 'delete_categories',
                'view_sales', 'create_sales', 'edit_sales', 'delete_sales',
                'view_users', 'create_users', 'edit_users', 'delete_users',
                'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
                'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders', 'delete_purchase_orders',
                'approve_purchase_orders', 'receive_purchase_orders',
                'view_reports', 'view_analytics',
                'view_shifts', 'create_shifts', 'close_shifts',
                'view_settings', 'edit_settings', 'manage_roles', 'manage_permissions'
            ],
            'admin' => [
                // Admin has all permissions except role/permission management
                'view_dashboard', 'view_products', 'create_products', 'edit_products', 'delete_products',
                'view_categories', 'create_categories', 'edit_categories', 'delete_categories',
                'view_sales', 'create_sales', 'edit_sales', 'delete_sales',
                'view_users', 'create_users', 'edit_users', 'delete_users',
                'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
                'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders', 'delete_purchase_orders',
                'approve_purchase_orders', 'receive_purchase_orders',
                'view_reports', 'view_analytics',
                'view_shifts', 'create_shifts', 'close_shifts',
                'view_settings'
            ],
            'manager' => [
                // Manager has most permissions except user management and some settings
                'view_dashboard', 'view_products', 'create_products', 'edit_products',
                'view_categories', 'create_categories', 'edit_categories',
                'view_sales', 'create_sales', 'edit_sales',
                'view_suppliers', 'create_suppliers', 'edit_suppliers',
                'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders',
                'approve_purchase_orders', 'receive_purchase_orders',
                'view_reports', 'view_analytics',
                'view_shifts', 'create_shifts', 'close_shifts'
            ],
            'kasir' => [
                // Kasir has limited permissions
                'view_dashboard', 'view_products', 'view_categories',
                'view_sales', 'create_sales',
                'view_shifts', 'create_shifts', 'close_shifts'
            ]
        ];

        // Clear existing role permissions
        RolePermission::truncate();

        // Assign permissions to roles
        foreach ($rolePermissions as $role => $permissionNames) {
            foreach ($permissionNames as $permissionName) {
                $permission = Permission::where('name', $permissionName)->first();
                if ($permission) {
                    RolePermission::firstOrCreate([
                        'role' => $role,
                        'permission_id' => $permission->id
                    ]);
                }
            }
        }
    }
}
