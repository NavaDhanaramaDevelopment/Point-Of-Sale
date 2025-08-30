<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PosController;

Route::middleware(['auth', 'verified'])->prefix('pos')->group(function () {
    Route::get('/', [PosController::class, 'index'])->name('pos.index');
    Route::post('/scan-barcode', [PosController::class, 'scanBarcode'])->name('pos.scanBarcode');
    Route::post('/store', [PosController::class, 'store'])->name('pos.store');
    Route::post('/hold', [PosController::class, 'holdCart'])->name('pos.hold');
    Route::post('/refund', [PosController::class, 'refund'])->name('pos.refund');
    Route::get('/search-customers', [PosController::class, 'searchCustomers'])->name('pos.searchCustomers');
    Route::post('/find-or-create-customer', [PosController::class, 'findOrCreateCustomer'])->name('pos.findOrCreateCustomer');
});
