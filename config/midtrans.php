<?php

return [
    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),
    'is_3ds' => env('MIDTRANS_IS_3DS', true),

    // Notification URL untuk webhook
    'notification_url' => env('APP_URL') . '/api/midtrans/notification',
    'finish_url' => env('APP_URL') . '/subscription/success',
    'error_url' => env('APP_URL') . '/subscription/failed',
    'unfinish_url' => env('APP_URL') . '/subscription/pending',
];
