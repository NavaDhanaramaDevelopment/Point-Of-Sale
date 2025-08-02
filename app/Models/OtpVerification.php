<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OtpVerification extends Model
{
    protected $fillable = [
        'phone',
        'otp_code',
        'expires_at',
        'is_verified',
        'verified_at',
        'user_data',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified_at' => 'datetime',
        'is_verified' => 'boolean',
        'user_data' => 'array',
    ];

    /**
     * Check if OTP is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    /**
     * Check if OTP is valid
     */
    public function isValid(): bool
    {
        return !$this->is_verified && !$this->isExpired();
    }

    /**
     * Mark OTP as verified
     */
    public function markAsVerified(): void
    {
        $this->update([
            'is_verified' => true,
            'verified_at' => now(),
        ]);
    }

    /**
     * Generate new OTP code
     */
    public static function generateOtp(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create new OTP verification
     */
    public static function createForPhone(string $phone, array $userData = null): self
    {
        // Delete existing OTP for this phone
        static::where('phone', $phone)->delete();

        return static::create([
            'phone' => $phone,
            'otp_code' => static::generateOtp(),
            'expires_at' => now()->addMinutes(5), // OTP expires in 5 minutes
            'user_data' => $userData,
        ]);
    }
}
