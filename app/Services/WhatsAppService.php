<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $apiUrl;
    protected $token;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url');
        $this->token = config('services.whatsapp.token');
    }

    /**
     * Send OTP via WhatsApp
     */
    public function sendOtp(string $phone, string $otpCode): bool
    {
        try {
            // Format phone number (remove leading 0, add 62)
            $formattedPhone = $this->formatPhoneNumber($phone);

            $message = "Kode OTP Anda untuk registrasi POS Retail: *{$otpCode}*\n\n";
            $message .= "Kode ini berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.";

            $curl = curl_init();

            $postFields = [
                'appkey' => env('WAPANEL_APP_KEY'),
                'authkey' => env('WAPANEL_AUTH_KEY'),
                'to' => $formattedPhone,
                'message' => $message,
                'sandbox' => 'false'
            ];

            // Send WhatsApp message
            curl_setopt_array($curl, array(
                CURLOPT_URL => env('WHATSAPP_API_URL').'create-message',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $postFields,
                CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ));

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);


            if (curl_errno($curl)) {
                $error = curl_error($curl);
                curl_close($curl);
                Log::error('WhatsApp cURL error: ' . $error);
                return [
                    'success' => false,
                    'message' => 'Connection error: ' . $error
                ];
            }

            curl_close($curl);


            if ($httpCode == 200) {
                Log::info('WhatsApp OTP sent successfully', [
                    'phone' => $phone,
                ]);

                // return [
                //     'success' => true,
                //     'message' => 'OTP telah dikirim ke WhatsApp Anda',
                //     'otp_id' => $otp->id
                // ];

                return true;
            } else {
                Log::error('Failed to send WhatsApp OTP', [
                    'phone' => $phone,
                    'status' => $httpCode
                ]);

                // return [
                //     'success' => false,
                //     'message' => 'Gagal mengirim OTP. Silakan coba lagi.'
                // ];

                return false;
            }

            return false;
        } catch (\Exception $e) {
            Log::error("WhatsApp OTP send error: " . $e->getMessage(), [
                'phone' => $phone,
                'exception' => $e,
            ]);
            return false;
        }
    }

    /**
     * Format phone number for WhatsApp API
     */
    private function formatPhoneNumber(string $phone): string
    {
        // Remove all non-digit characters
        $phone = preg_replace('/\D/', '', $phone);

        // Remove leading zero and add 62 (Indonesia country code)
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        return $phone;
    }
}
