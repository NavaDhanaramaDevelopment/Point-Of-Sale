<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shift_id',
        'customer_id',
        'customer_name',
        'customer_contact',
        'total',
        'discount',
        'tax',
        'grand_total',
        'payment_method',
        'payment_details',
        'status',
    ];

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
