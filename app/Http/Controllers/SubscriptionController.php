<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\UserSubscription;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Display subscription plans
     */
    public function index()
    {
        $subscriptions = Subscription::where('is_active', true)->get();
        $userSubscription = auth()->user()->activeSubscription;

        return Inertia::render('Subscription/Index', [
            'subscriptions' => $subscriptions,
            'userSubscription' => $userSubscription,
            'midtransClientKey' => config('midtrans.client_key')
        ]);
    }

    /**
     * Subscribe to a plan
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id'
        ]);

        $user = auth()->user();

        // Check if user already has active subscription
        if ($user->activeSubscription) {
            return redirect()->back()->with('error', 'Anda sudah memiliki langganan aktif.');
        }

        $subscription = Subscription::findOrFail($request->subscription_id);

        try {
            // Create order ID
            $orderId = 'ORDER-' . $user->id . '-' . time();

            // Create subscription record
            $userSubscription = UserSubscription::create([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'midtrans_order_id' => $orderId,
                'status' => 'pending',
                'payment_status' => 'pending',
                'started_at' => now(),
                'expired_at' => now()->addMonths($subscription->duration),
            ]);

            // Create Midtrans payment token
            $paymentData = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => $subscription->price,
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                ],
                'item_details' => [
                    [
                        'id' => $subscription->id,
                        'price' => $subscription->price,
                        'quantity' => 1,
                        'name' => $subscription->name . ' Plan - Monthly Subscription',
                    ]
                ]
            ];

            $snapToken = $this->midtransService->createTransaction($paymentData);

            if ($snapToken['success']) {
                return Inertia::render('Subscription/Payment', [
                    'subscription' => $subscription,
                    'paymentToken' => $snapToken['snap_token'],
                    'midtransClientKey' => config('midtrans.client_key')
                ]);
            } else {
                $userSubscription->delete();
                return redirect()->back()->with('error', 'Gagal membuat token pembayaran');
            }

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membuat pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Payment success callback
     */
    public function paymentSuccess(Request $request)
    {
        $orderId = $request->get('order_id');

        if ($orderId) {
            $userSubscription = UserSubscription::where('midtrans_order_id', $orderId)->first();

            if ($userSubscription) {
                // Verify payment status with Midtrans
                $status = $this->midtransService->getTransactionStatus($orderId);

                if ($status['success']) {
                    $transactionStatus = $status['data']->transaction_status;

                    if (in_array($transactionStatus, ['capture', 'settlement'])) {
                        $userSubscription->update([
                            'status' => 'active',
                            'payment_status' => 'paid',
                            'midtrans_transaction_id' => $status['data']->transaction_id,
                            'payment_method' => $status['data']->payment_type ?? null,
                        ]);

                        return Inertia::render('Subscription/Success', [
                            'transaction' => $status['data'],
                            'subscription' => $userSubscription->subscription
                        ]);
                    }
                }
            }
        }

        return redirect()->route('subscription.index');
    }

    /**
     * Payment failed callback
     */
    public function paymentFailed(Request $request)
    {
        $orderId = $request->get('order_id');
        $error = $request->get('error');

        $userSubscription = null;
        $subscription = null;
        $transaction = null;

        if ($orderId && $orderId !== 'unknown') {
            $userSubscription = UserSubscription::where('midtrans_order_id', $orderId)->first();

            if ($userSubscription) {
                $subscription = $userSubscription->subscription;

                // Get transaction status for details
                $status = $this->midtransService->getTransactionStatus($orderId);
                if ($status['success']) {
                    $transaction = $status['data'];
                }

                // Update status to failed
                $userSubscription->update([
                    'status' => 'cancelled',
                    'payment_status' => 'failed'
                ]);
            }
        }

        return Inertia::render('Subscription/Failed', [
            'transaction' => $transaction,
            'subscription' => $subscription,
            'error' => $error
        ]);
    }

    /**
     * Payment pending page
     */
    public function pending(Request $request)
    {
        $orderId = $request->query('order_id');

        if (!$orderId) {
            return redirect()->route('subscription.index')
                ->with('error', 'Order ID tidak ditemukan');
        }

        $userSubscription = UserSubscription::where('midtrans_order_id', $orderId)
            ->where('user_id', auth()->id())
            ->with('subscription')
            ->first();

        if (!$userSubscription) {
            return redirect()->route('subscription.index')
                ->with('error', 'Subscription tidak ditemukan');
        }

        // Simulate transaction data for display
        $transaction = [
            'order_id' => $userSubscription->midtrans_order_id,
            'gross_amount' => $userSubscription->subscription->price,
            'transaction_time' => $userSubscription->created_at,
            'transaction_status' => 'pending',
            'payment_type' => $userSubscription->payment_method ?: 'various',
            'transaction_id' => $userSubscription->midtrans_transaction_id ?: 'pending'
        ];

        return Inertia::render('Subscription/Pending', [
            'transaction' => $transaction,
            'subscription' => $userSubscription->subscription
        ]);
    }

    /**
     * Display user's subscription history
     */
    public function history()
    {
        $user = auth()->user();
        $userSubscriptions = $user->userSubscriptions()
                            ->with('subscription')
                            ->orderBy('created_at', 'desc')
                            ->get();

        $currentSubscription = $user->activeSubscription;

        return Inertia::render('Subscription/History', [
            'userSubscriptions' => $userSubscriptions,
            'currentSubscription' => $currentSubscription
        ]);
    }

    /**
     * Webhook handler for Midtrans
     */
    public function webhook(Request $request)
    {
        $notification = $this->midtransService->handleNotification($request->all());

        if ($notification['success']) {
            $data = $notification['data'];
            $orderId = $data->order_id;

            $userSubscription = UserSubscription::where('midtrans_order_id', $orderId)->first();

            if ($userSubscription) {
                $transactionStatus = $data->transaction_status;

                switch ($transactionStatus) {
                    case 'capture':
                    case 'settlement':
                        $userSubscription->update([
                            'status' => 'active',
                            'payment_status' => 'paid',
                            'midtrans_transaction_id' => $data->transaction_id,
                            'payment_method' => $data->payment_type ?? null,
                        ]);
                        break;

                    case 'pending':
                        $userSubscription->update([
                            'payment_status' => 'pending'
                        ]);
                        break;

                    case 'deny':
                    case 'cancel':
                    case 'expire':
                    case 'failure':
                        $userSubscription->update([
                            'status' => 'cancelled',
                            'payment_status' => 'failed'
                        ]);
                        break;
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Cancel subscription
     */
    public function cancel(Request $request)
    {
        $user = auth()->user();
        $activeSubscription = $user->activeSubscription;

        if (!$activeSubscription) {
            return redirect()->back()->with('error', 'Tidak ada langganan aktif untuk dibatalkan.');
        }

        $activeSubscription->update([
            'status' => 'cancelled'
        ]);

        return redirect()->route('subscription.index')->with('success', 'Langganan berhasil dibatalkan.');
    }
}
