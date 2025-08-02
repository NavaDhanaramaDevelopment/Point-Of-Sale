<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Outlet extends Model
{
    protected $fillable = [
        'name',
        'code',
        'address',
        'phone',
        'email',
        'manager_name',
        'is_active',
        'latitude',
        'longitude',
        'super_admin_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get users assigned to this outlet
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get customers for this outlet
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    /**
     * Get categories for this outlet
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Get products for this outlet
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get suppliers for this outlet
     */
    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }

    /**
     * Get customer debts for this outlet
     */
    public function customerDebts(): HasMany
    {
        return $this->hasMany(CustomerDebt::class);
    }

    /**
     * Get supplier debts for this outlet
     */
    public function supplierDebts(): HasMany
    {
        return $this->hasMany(SupplierDebt::class);
    }

    /**
     * Get transfers from this outlet
     */
    public function transfersFrom(): HasMany
    {
        return $this->hasMany(OutletTransfer::class, 'from_outlet_id');
    }

    /**
     * Get transfers to this outlet
     */
    public function transfersTo(): HasMany
    {
        return $this->hasMany(OutletTransfer::class, 'to_outlet_id');
    }

    /**
     * Get the super admin (manager) who owns this outlet
     */
    public function superAdmin()
    {
        return $this->belongsTo(User::class, 'super_admin_id');
    }
}
