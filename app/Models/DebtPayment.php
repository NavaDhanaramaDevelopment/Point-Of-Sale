<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DebtPayment extends Model
{
    protected $fillable = [
        'debt_type',
        'debt_id',
        'outlet_id',
        'amount',
        'payment_date',
        'payment_method',
        'reference_number',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    /**
     * Get the outlet this payment belongs to
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Get the user who created this payment
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the associated customer debt (if debt_type is customer)
     */
    public function customerDebt(): BelongsTo
    {
        return $this->belongsTo(CustomerDebt::class, 'debt_id')->where('debt_type', 'customer');
    }

    /**
     * Get the associated supplier debt (if debt_type is supplier)
     */
    public function supplierDebt(): BelongsTo
    {
        return $this->belongsTo(SupplierDebt::class, 'debt_id')->where('debt_type', 'supplier');
    }

    /**
     * Get the debt record (polymorphic relationship)
     */
    public function debt()
    {
        if ($this->debt_type === 'customer') {
            return CustomerDebt::find($this->debt_id);
        } elseif ($this->debt_type === 'supplier') {
            return SupplierDebt::find($this->debt_id);
        }

        return null;
    }
}
