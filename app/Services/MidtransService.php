<?php

namespace App\Services;

use App\Models\UserSubscription;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Create payment token for subscription
     */
    public function createPaymentToken(UserSubscription $userSubscription): string
    {
        $user = $userSubscription->user;
        $subscription = $userSubscription->subscription;

        $params = [
            'transaction_details' => [
                'order_id' => $userSubscription->midtrans_order_id,
                'gross_amount' => $userSubscription->amount_paid,
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
                    'name' => "Subscription {$subscription->name} - {$subscription->duration} Bulan",
                    'brand' => 'POS Retail',
                    'category' => 'Subscription'
                ]
            ],
            'callbacks' => [
                'finish' => config('midtrans.finish_url'),
                'error' => config('midtrans.error_url'),
                'pending' => config('midtrans.unfinish_url')
            ],
            'expiry' => [
                'start_time' => date('Y-m-d H:i:s O'),
                'unit' => 'hour',
                'duration' => 24
            ]
        ];

        return Snap::getSnapToken($params);
    }

    /**
     * Create transaction and get snap token
     */
    public function createTransaction(array $paymentData): array
    {
        try {
            $snapToken = Snap::getSnapToken($paymentData);
            return [
                'success' => true,
                'snap_token' => $snapToken
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get transaction status from Midtrans
     */
    public function getTransactionStatus(string $orderId): array
    {
        try {
            $status = Transaction::status($orderId);
            return [
                'success' => true,
                'data' => $status
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Process notification from Midtrans webhook
     */
    public function processNotification(array $notification): array
    {
        try {
            $orderId = $notification['order_id'];
            $transactionStatus = $notification['transaction_status'];
            $fraudStatus = $notification['fraud_status'] ?? '';

            $userSubscription = UserSubscription::where('midtrans_order_id', $orderId)->first();

            if (!$userSubscription) {
                return [
                    'success' => false,
                    'message' => 'User subscription not found'
                ];
            }

            // Update transaction ID
            $userSubscription->midtrans_transaction_id = $notification['transaction_id'] ?? '';

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $userSubscription->payment_status = 'pending';
                } else if ($fraudStatus == 'accept') {
                    $userSubscription->payment_status = 'paid';
                    $userSubscription->status = 'active';
                }
            } else if ($transactionStatus == 'settlement') {
                $userSubscription->payment_status = 'paid';
                $userSubscription->status = 'active';
            } else if ($transactionStatus == 'pending') {
                $userSubscription->payment_status = 'pending';
            } else if ($transactionStatus == 'deny') {
                $userSubscription->payment_status = 'failed';
                $userSubscription->status = 'cancelled';
            } else if ($transactionStatus == 'expire') {
                $userSubscription->payment_status = 'failed';
                $userSubscription->status = 'cancelled';
            } else if ($transactionStatus == 'cancel') {
                $userSubscription->payment_status = 'cancelled';
                $userSubscription->status = 'cancelled';
            }

            $userSubscription->save();

            return [
                'success' => true,
                'message' => 'Notification processed successfully'
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Handle notification from Midtrans webhook
     */
    public function handleNotification(array $notification): array
    {
        return $this->processNotification($notification);
    }
}
