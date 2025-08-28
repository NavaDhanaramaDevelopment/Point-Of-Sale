<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\CustomerDebtController;
use App\Http\Controllers\SupplierDebtController;
use App\Http\Controllers\OutletTransferController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SupplierController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Subscription Routes
// Category Management (CRUD)
Route::middleware(['auth'])->resource('category', CategoryController::class);
// Sub Category Management (CRUD)
Route::middleware(['auth'])->resource('subcategory', SubcategoryController::class);
// Product Management (CRUD)
Route::middleware(['auth'])->prefix('product')->name('product.')->group(function () {
    Route::get('/', [\App\Http\Controllers\ProductController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\ProductController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\ProductController::class, 'store'])->name('store');
    Route::get('/{product}/edit', [\App\Http\Controllers\ProductController::class, 'edit'])->name('edit');
    Route::post('/{product}', [\App\Http\Controllers\ProductController::class, 'update'])->name('update');
    Route::delete('/{product}', [\App\Http\Controllers\ProductController::class, 'destroy'])->name('destroy');
});

// Stock Management Routes
Route::middleware(['auth', 'role:manager,admin'])->prefix('stock')->name('stock.')->group(function () {
    Route::get('/', [StockController::class, 'index'])->name('index');
    Route::get('/in', [StockController::class, 'stockIn'])->name('in');
    Route::post('/in', [StockController::class, 'storeStockIn'])->name('in.store');
    Route::get('/out', [StockController::class, 'stockOut'])->name('out');
    Route::post('/out', [StockController::class, 'storeStockOut'])->name('out.store');
    Route::get('/adjustment', [StockController::class, 'adjustment'])->name('adjustment');
    Route::post('/adjustment', [StockController::class, 'storeAdjustment'])->name('adjustment.store');
    Route::get('/report', [StockController::class, 'report'])->name('report');
    Route::post('/report/data', [StockController::class, 'reportData'])->name('report.data');
});

// Customer Management Routes
Route::middleware(['auth'])->prefix('customers')->name('customers.')->group(function () {
    Route::get('/', [CustomerController::class, 'index'])->name('index');
    Route::get('/create', [CustomerController::class, 'create'])->name('create');
    Route::post('/', [CustomerController::class, 'store'])->name('store');
    Route::get('/{customer}', [CustomerController::class, 'show'])->name('show');
    Route::get('/{customer}/edit', [CustomerController::class, 'edit'])->name('edit');
    Route::put('/{customer}', [CustomerController::class, 'update'])->name('update');
    Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('destroy');
    Route::post('/{customer}/adjust-points', [CustomerController::class, 'adjustPoints'])->name('adjust-points');
    Route::get('/search/json', [CustomerController::class, 'search'])->name('search');
    Route::get('/loyalty/report', [CustomerController::class, 'loyaltyReport'])->name('loyalty.report');
});

// Shift Management Routes
Route::middleware(['auth'])->prefix('shifts')->name('shifts.')->group(function () {
    Route::get('/', [\App\Http\Controllers\ShiftController::class, 'index'])->name('index');
    Route::get('/{shift}', [\App\Http\Controllers\ShiftController::class, 'show'])->name('show');
    Route::get('/open/form', [\App\Http\Controllers\ShiftController::class, 'openForm'])->name('open.form');
    Route::post('/open', [\App\Http\Controllers\ShiftController::class, 'open'])->name('open');
    Route::get('/{shift}/close/form', [\App\Http\Controllers\ShiftController::class, 'closeForm'])->name('close.form');
    Route::post('/{shift}/close', [\App\Http\Controllers\ShiftController::class, 'close'])->name('close');
    Route::get('/api/current', [\App\Http\Controllers\ShiftController::class, 'current'])->name('current');
    Route::get('/summary/view', [\App\Http\Controllers\ShiftController::class, 'summary'])->name('summary');
});

// Report Management Routes
Route::middleware(['auth', 'role:manager,admin'])->prefix('reports')->name('reports.')->group(function () {
    Route::get('/', [\App\Http\Controllers\ReportController::class, 'index'])->name('index');
    Route::get('/sales', [\App\Http\Controllers\ReportController::class, 'sales'])->name('sales');
    Route::get('/products', [\App\Http\Controllers\ReportController::class, 'products'])->name('products');
    Route::get('/analytics', [\App\Http\Controllers\ReportController::class, 'analytics'])->name('analytics');
    Route::get('/kasir', [\App\Http\Controllers\ReportController::class, 'kasir'])->name('kasir');
});

// User Management Routes
Route::middleware(['auth'])->prefix('users')->name('users.')->group(function () {
    Route::get('/', [\App\Http\Controllers\UserController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\UserController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\UserController::class, 'store'])->name('store');
    Route::get('/{user}', [\App\Http\Controllers\UserController::class, 'show'])->name('show');
    Route::get('/{user}/edit', [\App\Http\Controllers\UserController::class, 'edit'])->name('edit');
    Route::put('/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('update');
    Route::delete('/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('destroy');
    Route::get('/permissions/manage', [\App\Http\Controllers\UserController::class, 'permissions'])->name('permissions');
    Route::post('/permissions/update', [\App\Http\Controllers\UserController::class, 'updatePermissions'])->name('permissions.update');
});

// Supplier Management Routes
Route::middleware(['auth'])->prefix('suppliers')->name('suppliers.')->group(function () {
    Route::get('/', [\App\Http\Controllers\SupplierController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\SupplierController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\SupplierController::class, 'store'])->name('store');
    Route::get('/{supplier}', [\App\Http\Controllers\SupplierController::class, 'show'])->name('show');
    Route::get('/{supplier}/edit', [\App\Http\Controllers\SupplierController::class, 'edit'])->name('edit');
    Route::put('/{supplier}', [\App\Http\Controllers\SupplierController::class, 'update'])->name('update');
    Route::delete('/{supplier}', [\App\Http\Controllers\SupplierController::class, 'destroy'])->name('destroy');
});

// Purchase Order Management Routes
Route::middleware(['auth'])->prefix('purchase-orders')->name('purchase-orders.')->group(function () {
    Route::get('/', [\App\Http\Controllers\PurchaseOrderController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\PurchaseOrderController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\PurchaseOrderController::class, 'store'])->name('store');
    Route::get('/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'show'])->name('show');
    Route::get('/{purchaseOrder}/edit', [\App\Http\Controllers\PurchaseOrderController::class, 'edit'])->name('edit');
    Route::put('/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'update'])->name('update');
    Route::delete('/{purchaseOrder}', [\App\Http\Controllers\PurchaseOrderController::class, 'destroy'])->name('destroy');
    Route::post('/{purchaseOrder}/submit', [\App\Http\Controllers\PurchaseOrderController::class, 'submit'])->name('submit');
    Route::post('/{purchaseOrder}/approve', [\App\Http\Controllers\PurchaseOrderController::class, 'approve'])->name('approve');
    Route::post('/{purchaseOrder}/receive', [\App\Http\Controllers\PurchaseOrderController::class, 'receive'])->name('receive');
});

Route::middleware(['auth'])->prefix('subscription')->name('subscription.')->group(function () {

    Route::get('/', [SubscriptionController::class, 'index'])->name('index');
    Route::post('/subscribe', [SubscriptionController::class, 'subscribe'])->name('subscribe');
    Route::get('/history', [SubscriptionController::class, 'history'])->name('history');
    Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');

    // Payment callbacks
    Route::get('/success', [SubscriptionController::class, 'paymentSuccess'])->name('success');
    Route::get('/failed', [SubscriptionController::class, 'paymentFailed'])->name('failed');
    Route::get('/pending', [SubscriptionController::class, 'pending'])->name('pending');

    // Webhook for Midtrans
    Route::post('/webhook', [SubscriptionController::class, 'webhook'])->name('webhook');
});

// Owner Routes
Route::middleware(['auth', 'role:owner'])->prefix('owner')->name('owner.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'ownerDashboard'])->name('dashboard');

    // User Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Role Management
    Route::get('/roles', [UserController::class, 'roleIndex'])->name('roles.index');
    Route::post('/roles', [UserController::class, 'roleStore'])->name('roles.store');
    Route::put('/roles/{role}', [UserController::class, 'roleUpdate'])->name('roles.update');
    Route::delete('/roles/{role}', [UserController::class, 'roleDestroy'])->name('roles.destroy');

    // Permission Management
    Route::get('/permissions', [UserController::class, 'permissionIndex'])->name('permissions.index');
    Route::post('/permissions', [UserController::class, 'permissionStore'])->name('permissions.store');
    Route::put('/permissions/{permission}', [UserController::class, 'permissionUpdate'])->name('permissions.update');
    Route::delete('/permissions/{permission}', [UserController::class, 'permissionDestroy'])->name('permissions.destroy');

    // Outlet Management
    Route::get('/outlets', [OutletController::class, 'index'])->name('outlets.index');
    Route::post('/outlets', [OutletController::class, 'store'])->name('outlets.store');
    Route::put('/outlets/{outlet}', [OutletController::class, 'update'])->name('outlets.update');
    Route::delete('/outlets/{outlet}', [OutletController::class, 'destroy'])->name('outlets.destroy');
    Route::patch('/outlets/{outlet}/toggle-status', [OutletController::class, 'toggleStatus'])->name('outlets.toggle-status');
});

// Debt Management Routes (accessible by owner, admin, manager)
Route::middleware(['auth', 'role:owner,admin,manager'])->group(function () {
    // Customer Debts
    Route::prefix('customer-debts')->name('customer-debts.')->group(function () {
        Route::get('/', [CustomerDebtController::class, 'index'])->name('index');
        Route::post('/', [CustomerDebtController::class, 'store'])->name('store');
        Route::put('/{debt}', [CustomerDebtController::class, 'update'])->name('update');
        Route::delete('/{debt}', [CustomerDebtController::class, 'destroy'])->name('destroy');
        Route::post('/{debt}/payment', [CustomerDebtController::class, 'recordPayment'])->name('payment');
        Route::get('/overdue', [CustomerDebtController::class, 'overdueDebts'])->name('overdue');
    });

    // Supplier Debts
    Route::prefix('supplier-debts')->name('supplier-debts.')->group(function () {
        Route::get('/', [SupplierDebtController::class, 'index'])->name('index');
        Route::post('/', [SupplierDebtController::class, 'store'])->name('store');
        Route::put('/{debt}', [SupplierDebtController::class, 'update'])->name('update');
        Route::delete('/{debt}', [SupplierDebtController::class, 'destroy'])->name('destroy');
        Route::post('/{debt}/payment', [SupplierDebtController::class, 'recordPayment'])->name('payment');
        Route::get('/overdue', [SupplierDebtController::class, 'overdueDebts'])->name('overdue');
    });
});

// Outlet Transfer Routes (accessible by owner, admin, manager)
Route::middleware(['auth', 'role:owner,admin,manager'])->prefix('transfers')->name('transfers.')->group(function () {
    Route::get('/', [OutletTransferController::class, 'index'])->name('index');
    Route::get('/create', [OutletTransferController::class, 'create'])->name('create');
    Route::post('/', [OutletTransferController::class, 'store'])->name('store');
    Route::get('/{transfer}', [OutletTransferController::class, 'show'])->name('show');
    Route::get('/{transfer}/edit', [OutletTransferController::class, 'edit'])->name('edit');
    Route::put('/{transfer}', [OutletTransferController::class, 'update'])->name('update');
    Route::patch('/{transfer}/status', [OutletTransferController::class, 'updateStatus'])->name('update-status');
    Route::patch('/{transfer}/cancel', [OutletTransferController::class, 'cancel'])->name('cancel');
    Route::delete('/{transfer}', [OutletTransferController::class, 'destroy'])->name('destroy');
});

// Admin Routes
Route::middleware(['auth', 'role:admin,owner'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard'])->name('dashboard');
});

// Manager Routes

Route::middleware(['auth', 'role:manager,admin,owner'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'managerDashboard'])->name('dashboard');

    // Outlet Management for Manager
    Route::get('/outlets', [OutletController::class, 'managerIndex'])->name('outlets.index');
    Route::get('/outlets/create', [OutletController::class, 'managerCreate'])->name('outlets.create');
    Route::post('/outlets', [OutletController::class, 'managerStore'])->name('outlets.store');
    Route::get('/outlets/{outlet}/edit', [OutletController::class, 'managerEdit'])->name('outlets.edit');
    Route::put('/outlets/{outlet}', [OutletController::class, 'managerUpdate'])->name('outlets.update');
    Route::delete('/outlets/{outlet}', [OutletController::class, 'managerDestroy'])->name('outlets.destroy');

    // User Management for Manager (admin and kasir only)
    Route::get('/users', [UserController::class, 'managerIndex'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'managerCreate'])->name('users.create');
    Route::post('/users', [UserController::class, 'managerStore'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'managerEdit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'managerUpdate'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'managerDestroy'])->name('users.destroy');

    // Supplier Management for Manager
    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::get('/suppliers/create', [SupplierController::class, 'create'])->name('suppliers.create');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
    Route::get('/suppliers/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');

    // Purchase Order Management for Manager
    Route::get('/purchase-orders', [PurchaseOrderController::class, 'index'])->name('purchase-orders.index');
    Route::get('/purchase-orders/create', [PurchaseOrderController::class, 'create'])->name('purchase-orders.create');
    Route::post('/purchase-orders', [PurchaseOrderController::class, 'store'])->name('purchase-orders.store');
    Route::get('/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'show'])->name('purchase-orders.show');
    Route::get('/purchase-orders/{purchaseOrder}/edit', [PurchaseOrderController::class, 'edit'])->name('purchase-orders.edit');
    Route::put('/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'update'])->name('purchase-orders.update');
    Route::delete('/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'destroy'])->name('purchase-orders.destroy');
    Route::post('/purchase-orders/{purchaseOrder}/submit', [PurchaseOrderController::class, 'submit'])->name('purchase-orders.submit');
    Route::post('/purchase-orders/{purchaseOrder}/approve', [PurchaseOrderController::class, 'approve'])->name('purchase-orders.approve');
    Route::post('/purchase-orders/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive'])->name('purchase-orders.receive');
});

// Kasir Routes
Route::middleware(['auth', 'role:kasir,manager,admin,owner'])->prefix('kasir')->name('kasir.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'kasirDashboard'])->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
require __DIR__.'/pos.php';
