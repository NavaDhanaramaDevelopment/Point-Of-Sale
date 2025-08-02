<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OutletTransfer extends Model
{
    protected $fillable = [
        'transfer_number',
        'from_outlet_id',
        'to_outlet_id',
        'status',
        'transfer_date',
        'expected_arrival_date',
        'received_date',
        'notes',
        'created_by',
        'received_by',
    ];

    protected $casts = [
        'transfer_date' => 'date',
        'expected_arrival_date' => 'date',
        'received_date' => 'date',
    ];

    /**
     * Get the source outlet
     */
    public function fromOutlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class, 'from_outlet_id');
    }

    /**
     * Get the destination outlet
     */
    public function toOutlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class, 'to_outlet_id');
    }

    /**
     * Get the user who created this transfer
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who received this transfer
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    /**
     * Get transfer items
     */
    public function items(): HasMany
    {
        return $this->hasMany(OutletTransferItem::class);
    }

    /**
     * Generate transfer number
     */
    public static function generateTransferNumber(): string
    {
        $lastTransfer = self::latest()->first();
        $nextNumber = $lastTransfer ? intval(substr($lastTransfer->transfer_number, -6)) + 1 : 1;

        return 'TRF-' . date('Ymd') . '-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Calculate total transfer value
     */
    public function getTotalValueAttribute(): float
    {
        return $this->items->sum('total_cost');
    }
}
