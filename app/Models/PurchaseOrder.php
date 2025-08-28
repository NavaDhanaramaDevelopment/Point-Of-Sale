<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number',
        'outlet_id',
        'supplier_id',
        'user_id',
        'order_date',
        'expected_date',
        'received_date',
        'status',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'notes'
    ];

    protected $casts = [
        'order_date' => 'date',
        'expected_date' => 'date',
        'received_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2'
    ];

     /**
     * Get the purchaseOrderItem that owns the purchase order.
     */
    public function purchaseOrderItem()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }    

    /**
     * Get the outlet that owns the purchase order.
     */
    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Get the supplier that owns the purchase order.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the user that created the purchase order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the purchase order.
     */
    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * Generate unique PO number
     */
    public static function generatePoNumber()
    {
        $lastPo = static::latest()->first();
        $number = $lastPo ? intval(substr($lastPo->po_number, 3)) + 1 : 1;
        return 'PO-' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Calculate totals
     */
    public function calculateTotals()
    {
        $this->subtotal = $this->items->sum('total_cost');
        $this->total_amount = $this->subtotal + $this->tax_amount - $this->discount_amount;
        $this->save();
    }

    /**
     * Scope queries for different statuses
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeReceived($query)
    {
        return $query->where('status', 'received');
    }
}
