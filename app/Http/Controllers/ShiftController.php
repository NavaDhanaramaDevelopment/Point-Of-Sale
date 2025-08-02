<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ShiftController extends Controller
{
    public function index()
    {
        $shifts = Shift::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Shift/Index', [
            'shifts' => $shifts
        ]);
    }

    public function show(Shift $shift)
    {
        $shift->load(['user', 'sales.items.product']);

        return Inertia::render('Shift/Show', [
            'shift' => $shift
        ]);
    }

    public function current()
    {
        $currentShift = Shift::where('user_id', auth()->id())
            ->open()
            ->first();

        return response()->json([
            'shift' => $currentShift
        ]);
    }

    public function open(Request $request)
    {
        // Cek apakah user sudah memiliki shift yang terbuka
        $existingShift = Shift::where('user_id', auth()->id())
            ->open()
            ->first();

        if ($existingShift) {
            return back()->withErrors(['error' => 'Anda masih memiliki shift yang terbuka']);
        }

        $request->validate([
            'opening_balance' => 'required|numeric|min:0',
            'opening_notes' => 'nullable|string'
        ]);

        $shift = Shift::create([
            'user_id' => auth()->id(),
            'opening_balance' => $request->opening_balance,
            'opening_notes' => $request->opening_notes,
            'started_at' => now(),
            'status' => 'open'
        ]);

        return redirect()->route('pos.index')->with('success', 'Shift berhasil dibuka');
    }

    public function close(Request $request, Shift $shift)
    {
        // Validasi bahwa shift milik user yang sedang login
        if ($shift->user_id !== auth()->id()) {
            abort(403);
        }

        // Validasi bahwa shift masih terbuka
        if ($shift->status !== 'open') {
            return back()->withErrors(['error' => 'Shift sudah ditutup']);
        }

        $request->validate([
            'closing_balance' => 'required|numeric|min:0',
            'closing_notes' => 'nullable|string'
        ]);

        // Update sales data terlebih dahulu
        $shift->updateSalesData();

        // Hitung expected balance
        $expectedBalance = $shift->opening_balance + $shift->cash_sales;
        $difference = $request->closing_balance - $expectedBalance;

        $shift->update([
            'closing_balance' => $request->closing_balance,
            'expected_balance' => $expectedBalance,
            'difference' => $difference,
            'closing_notes' => $request->closing_notes,
            'ended_at' => now(),
            'status' => 'closed'
        ]);

        return redirect()->route('shifts.index')->with('success', 'Shift berhasil ditutup');
    }

    public function openForm()
    {
        // Cek apakah user sudah memiliki shift yang terbuka
        $existingShift = Shift::where('user_id', auth()->id())
            ->open()
            ->first();

        if ($existingShift) {
            return redirect()->route('pos.index')->with('info', 'Anda sudah memiliki shift yang terbuka');
        }

        return Inertia::render('Shift/Open');
    }

    public function closeForm(Shift $shift)
    {
        // Validasi bahwa shift milik user yang sedang login
        if ($shift->user_id !== auth()->id()) {
            abort(403);
        }

        // Validasi bahwa shift masih terbuka
        if ($shift->status !== 'open') {
            return redirect()->route('shifts.index')->with('error', 'Shift sudah ditutup');
        }

        // Update sales data
        $shift->updateSalesData();

        // Hitung expected balance
        $expectedBalance = $shift->opening_balance + $shift->cash_sales;

        return Inertia::render('Shift/Close', [
            'shift' => $shift,
            'expected_balance' => $expectedBalance
        ]);
    }

    public function summary()
    {
        $userId = auth()->id();

        $todayShifts = Shift::where('user_id', $userId)
            ->whereDate('created_at', today())
            ->get();

        $weeklyShifts = Shift::where('user_id', $userId)
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->get();

        $monthlyShifts = Shift::where('user_id', $userId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->get();

        return Inertia::render('Shift/Summary', [
            'today' => [
                'shifts' => $todayShifts->count(),
                'total_sales' => $todayShifts->sum('total_sales'),
                'total_transactions' => $todayShifts->sum('total_transactions')
            ],
            'weekly' => [
                'shifts' => $weeklyShifts->count(),
                'total_sales' => $weeklyShifts->sum('total_sales'),
                'total_transactions' => $weeklyShifts->sum('total_transactions')
            ],
            'monthly' => [
                'shifts' => $monthlyShifts->count(),
                'total_sales' => $monthlyShifts->sum('total_sales'),
                'total_transactions' => $monthlyShifts->sum('total_transactions')
            ]
        ]);
    }
}
