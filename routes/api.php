<?php

use App\Http\Controllers\Api\MidtransWebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Midtrans webhook routes
Route::post('/midtrans/notification', [MidtransWebhookController::class, 'notification']);
