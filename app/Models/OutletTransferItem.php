<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutletTransferItem extends Model
{
    protected $fillable = [
        'outlet_transfer_id',
        'product_id',
        'quantity_requested',
        'quantity_sent',
        'quantity_received',
        'unit_cost',
        'total_cost',
        'notes',
    ];

    protected $casts = [
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    /**
     * Get the transfer this item belongs to
     */
    public function transfer(): BelongsTo
    {
        return $this->belongsTo(OutletTransfer::class, 'outlet_transfer_id');
    }

    /**
     * Get the product being transferred
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Calculate total cost when unit_cost or quantity changes
     */
    protected static function booted()
    {
        static::saving(function ($item) {
            $item->total_cost = $item->unit_cost * $item->quantity_sent;
        });
    }
}
