<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'description', 'category_id', 'subcategory_id', 'sku', 'barcode', 'unit',
        'purchase_price', 'selling_price', 'stock_quantity', 'minimum_stock', 'image', 'is_active',
        'outlet_id', 'super_admin_id'
    ];

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    /**
     * Scope a query to only include active products.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Hitung stock sebenarnya berdasarkan movement
     * IN + ADJUSTMENT - OUT = Stock Sisa
     */
    public function getActualStock()
    {
        $movements = $this->stockMovements;

        $stockIn = $movements->whereIn('type', ['in', 'adjustment'])->sum('quantity');
        $stockOut = $movements->where('type', 'out')->sum('quantity');

        return $stockIn - $stockOut;
    }

    /**
     * Attribute accessor untuk mendapatkan stock aktual
     */
    public function getActualStockAttribute()
    {
        return $this->getActualStock();
    }

    public function isStockLow()
    {
        return $this->getActualStock() <= $this->minimum_stock;
    }
}
