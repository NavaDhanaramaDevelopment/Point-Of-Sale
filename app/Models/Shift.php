<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'opening_balance',
        'closing_balance',
        'expected_balance',
        'difference',
        'started_at',
        'ended_at',
        'status',
        'opening_notes',
        'closing_notes',
        'cash_sales',
        'non_cash_sales',
        'total_transactions'
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'closing_balance' => 'decimal:2',
        'expected_balance' => 'decimal:2',
        'difference' => 'decimal:2',
        'cash_sales' => 'decimal:2',
        'non_cash_sales' => 'decimal:2',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'open',
        'cash_sales' => 0,
        'non_cash_sales' => 0,
        'total_transactions' => 0,
    ];

    // Relationship dengan User (Kasir)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship dengan Sales
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    // Scope untuk shift yang sedang buka
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    // Scope untuk shift yang sudah tutup
    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    // Method untuk mendapatkan durasi shift
    public function getDurationAttribute()
    {
        if ($this->started_at && $this->ended_at) {
            return $this->started_at->diffForHumans($this->ended_at, true);
        }

        if ($this->started_at) {
            return $this->started_at->diffForHumans(now(), true);
        }

        return null;
    }

    // Method untuk menghitung total sales
    public function getTotalSalesAttribute()
    {
        return $this->cash_sales + $this->non_cash_sales;
    }

    // Method untuk cek apakah shift masih buka
    public function isOpen()
    {
        return $this->status === 'open';
    }

    // Method untuk cek apakah shift sudah tutup
    public function isClosed()
    {
        return $this->status === 'closed';
    }

    // Method untuk update sales data
    public function updateSalesData()
    {
        $sales = $this->sales()->get();

        $this->cash_sales = $sales->where('payment_method', 'cash')->sum('total_amount');
        $this->non_cash_sales = $sales->whereNotIn('payment_method', ['cash'])->sum('total_amount');
        $this->total_transactions = $sales->count();

        $this->save();
    }
}
