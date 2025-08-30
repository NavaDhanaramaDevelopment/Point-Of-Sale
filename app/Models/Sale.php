<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'outlet_id',
        'shift_id',
        'customer_id',
        'customer_name',
        'customer_contact',
        'invoice',
        'total',
        'discount',
        'tax',
        'grand_total',
        'payment_method',
        'payment_details',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($sale) {
            if (empty($sale->invoice)) {
                $sale->invoice = $sale->generateInvoiceNumber();
            }
        });
    }

    public function generateInvoiceNumber()
    {
        $prefix = 'INV';
        $date = date('Ymd');
        $lastSale = static::whereDate('created_at', today())->latest('id')->first();
        $sequence = $lastSale ? (intval(substr($lastSale->invoice, -4)) + 1) : 1;

        return $prefix . $date . sprintf('%04d', $sequence);
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }
}
