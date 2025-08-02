<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_date',
        'user_id',
        'total_sales',
        'cash_sales',
        'non_cash_sales',
        'total_transactions',
        'total_cost',
        'gross_profit',
        'top_products',
        'payment_methods'
    ];

    protected $casts = [
        'report_date' => 'date',
        'total_sales' => 'decimal:2',
        'cash_sales' => 'decimal:2',
        'non_cash_sales' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'gross_profit' => 'decimal:2',
        'top_products' => 'array',
        'payment_methods' => 'array',
    ];

    // Relationship dengan User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Method untuk generate report berdasarkan sales
    public static function generateReport($date, $userId = null)
    {
        $query = Sale::whereDate('created_at', $date);
        
        if ($userId) {
            $query->where('user_id', $userId);
        }
        
        $sales = $query->get();
        
        $totalSales = $sales->sum('total_amount');
        $cashSales = $sales->where('payment_method', 'cash')->sum('total_amount');
        $nonCashSales = $sales->whereNotIn('payment_method', ['cash'])->sum('total_amount');
        $totalTransactions = $sales->count();
        
        // Hitung top products
        $topProducts = $sales->flatMap(function ($sale) {
            return $sale->items;
        })->groupBy('product_id')->map(function ($items) {
            return [
                'product_name' => $items->first()->product->name,
                'quantity' => $items->sum('quantity'),
                'total_amount' => $items->sum('total_price')
            ];
        })->sortByDesc('quantity')->take(10)->values();
        
        // Hitung payment methods
        $paymentMethods = $sales->groupBy('payment_method')->map(function ($sales, $method) {
            return [
                'method' => $method,
                'count' => $sales->count(),
                'amount' => $sales->sum('total_amount')
            ];
        })->values();
        
        return [
            'report_date' => $date,
            'user_id' => $userId,
            'total_sales' => $totalSales,
            'cash_sales' => $cashSales,
            'non_cash_sales' => $nonCashSales,
            'total_transactions' => $totalTransactions,
            'total_cost' => 0, // Will be calculated if needed
            'gross_profit' => $totalSales, // Simplified for now
            'top_products' => $topProducts,
            'payment_methods' => $paymentMethods
        ];
    }
}
