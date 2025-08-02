<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupplierDebt extends Model
{
    protected $fillable = [
        'supplier_id',
        'outlet_id',
        'purchase_order_id',
        'invoice_number',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'due_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    /**
     * Get the supplier that owns this debt
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the outlet this debt belongs to
     */
    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Get the purchase order associated with this debt
     */
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * Get payments for this debt
     */
    public function payments(): HasMany
    {
        return $this->hasMany(DebtPayment::class, 'debt_id')->where('debt_type', 'supplier');
    }

    /**
     * Check if debt is overdue
     */
    public function isOverdue(): bool
    {
        return $this->due_date < now()->toDateString() && $this->status !== 'paid';
    }

    /**
     * Update debt status based on payments
     */
    public function updateStatus(): void
    {
        if ($this->remaining_amount <= 0) {
            $this->status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->status = 'partial';
        } elseif ($this->isOverdue()) {
            $this->status = 'overdue';
        } else {
            $this->status = 'pending';
        }

        $this->save();
    }
}
