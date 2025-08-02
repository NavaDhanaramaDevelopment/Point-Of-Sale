<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\User;
use App\Models\DailyReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Report/Index');
    }

    public function sales(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));
        $period = $request->input('period', 'daily'); // daily, weekly, monthly
        $kasirId = $request->input('kasir_id');

        $query = Sale::whereBetween('created_at', [$startDate, $endDate]);

        if ($kasirId) {
            $query->where('user_id', $kasirId);
        }

        $sales = $query->with(['user', 'items.product'])->get();

        // Group data berdasarkan periode
        $groupedData = [];

        if ($period === 'daily') {
            $groupedData = $sales->groupBy(function($sale) {
                return $sale->created_at->format('Y-m-d');
            });
        } elseif ($period === 'weekly') {
            $groupedData = $sales->groupBy(function($sale) {
                return $sale->created_at->format('Y-W');
            });
        } elseif ($period === 'monthly') {
            $groupedData = $sales->groupBy(function($sale) {
                return $sale->created_at->format('Y-m');
            });
        }

        $reportData = $groupedData->map(function($periodSales) {
            return [
                'total_sales' => $periodSales->sum('grand_total'),
                'total_transactions' => $periodSales->count(),
                'cash_sales' => $periodSales->where('payment_method', 'cash')->sum('grand_total'),
                'non_cash_sales' => $periodSales->whereNotIn('payment_method', ['cash'])->sum('grand_total'),
                'avg_transaction' => $periodSales->avg('grand_total')
            ];
        });

        $kasirs = User::where('role', 'kasir')->get(['id', 'name']);

        return Inertia::render('Report/Sales', [
            'reportData' => $reportData,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'period' => $period,
                'kasir_id' => $kasirId
            ],
            'kasirs' => $kasirs,
            'totalSales' => $sales->sum('grand_total'),
            'totalTransactions' => $sales->count()
        ]);
    }

    public function products(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));
        $categoryId = $request->input('category_id');

        $query = SaleItem::whereHas('sale', function($q) use ($startDate, $endDate) {
            $q->whereBetween('created_at', [$startDate, $endDate]);
        })->with(['product.category', 'sale']);

        if ($categoryId) {
            $query->whereHas('product', function($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }

        $saleItems = $query->get();

        $productReport = $saleItems->groupBy('product_id')->map(function($items) {
            $product = $items->first()->product;
            return [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'category_name' => $product->category->name,
                'total_quantity' => $items->sum('qty'),
                'total_revenue' => $items->sum('price'),
                'transaction_count' => $items->count(),
                'avg_price' => $items->avg('price')
            ];
        })->sortByDesc('total_quantity')->values();

        $categories = \App\Models\Category::all(['id', 'name']);

        return Inertia::render('Report/Products', [
            'productReport' => $productReport,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'category_id' => $categoryId
            ],
            'categories' => $categories
        ]);
    }

    public function analytics()
    {
        $today = now();
        $yesterday = now()->subDay();
        $lastWeek = now()->subWeek();
        $lastMonth = now()->subMonth();

        // Sales hari ini vs kemarin
        $todaySales = Sale::whereDate('created_at', $today)->sum('grand_total');
        $yesterdaySales = Sale::whereDate('created_at', $yesterday)->sum('grand_total');
        $salesGrowth = $yesterdaySales > 0 ? (($todaySales - $yesterdaySales) / $yesterdaySales) * 100 : 0;

        // Transaksi hari ini vs kemarin
        $todayTransactions = Sale::whereDate('created_at', $today)->count();
        $yesterdayTransactions = Sale::whereDate('created_at', $yesterday)->count();
        $transactionGrowth = $yesterdayTransactions > 0 ? (($todayTransactions - $yesterdayTransactions) / $yesterdayTransactions) * 100 : 0;

        // Top products (7 hari terakhir)
        $topProducts = SaleItem::whereHas('sale', function($q) {
            $q->where('created_at', '>=', now()->subDays(7));
        })->with('product')
        ->select('product_id', DB::raw('SUM(qty) as total_quantity'), DB::raw('SUM(price) as total_revenue'))
        ->groupBy('product_id')
        ->orderBy(DB::raw('SUM(qty)'), 'desc')
        ->limit(10)
        ->get();

        // Sales trend (30 hari terakhir)
        $salesTrend = Sale::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(grand_total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Performance per kasir (30 hari terakhir)
        $kasirPerformance = User::where('role', 'kasir')
            ->withCount(['sales' => function($q) {
                $q->where('created_at', '>=', now()->subDays(30));
            }])
            ->withSum(['sales' => function($q) {
                $q->where('created_at', '>=', now()->subDays(30));
            }], 'grand_total')
            ->get();

        return Inertia::render('Report/Analytics', [
            'todaySales' => $todaySales,
            'salesGrowth' => round($salesGrowth, 2),
            'todayTransactions' => $todayTransactions,
            'transactionGrowth' => round($transactionGrowth, 2),
            'topProducts' => $topProducts,
            'salesTrend' => $salesTrend,
            'kasirPerformance' => $kasirPerformance
        ]);
    }

    public function kasir(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));

        $kasirReport = User::where('role', 'kasir')
            ->withCount(['sales' => function($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            }])
            ->withSum(['sales' => function($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            }], 'grand_total')
            ->withCount(['shifts' => function($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            }])
            ->get()
            ->map(function($kasir) use ($startDate, $endDate) {
                $avgTransaction = $kasir->sales_count > 0 ? $kasir->sales_sum_grand_total / $kasir->sales_count : 0;

                return [
                    'id' => $kasir->id,
                    'name' => $kasir->name,
                    'total_sales' => $kasir->sales_sum_grand_total ?? 0,
                    'total_transactions' => $kasir->sales_count,
                    'total_shifts' => $kasir->shifts_count,
                    'avg_transaction' => round($avgTransaction, 2)
                ];
            });

        return Inertia::render('Report/Kasir', [
            'kasirReport' => $kasirReport,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }
}
