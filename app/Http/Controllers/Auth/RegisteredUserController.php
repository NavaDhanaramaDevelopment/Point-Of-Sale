<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\OtpVerification;
use App\Models\Outlet;
use App\Services\WhatsAppService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsAppService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration request and send OTP
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:15|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'business_name' => 'required|string|max:255',
        ]);

        // Store user data in OTP verification
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'business_name' => $request->business_name,
        ];

        $otpVerification = OtpVerification::createForPhone($request->phone, $userData);

        // Send OTP via WhatsApp
        $otpSent = $this->whatsappService->sendOtp($request->phone, $otpVerification->otp_code);

        if (!$otpSent) {
            return back()->withErrors(['phone' => 'Failed to send OTP. Please try again.']);
        }

        return Inertia::render('Auth/VerifyOtp', [
            'phone' => $request->phone,
            'message' => 'Kode OTP telah dikirim ke WhatsApp Anda. Silakan cek dan masukkan kode tersebut.',
        ]);
    }

    /**
     * Verify OTP and complete registration
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp_code' => 'required|string|size:6',
        ]);

        $otpVerification = OtpVerification::where('phone', $request->phone)
            ->where('otp_code', $request->otp_code)
            ->first();

        if (!$otpVerification || !$otpVerification->isValid()) {
            return back()->withErrors(['otp_code' => 'Kode OTP tidak valid atau sudah kadaluarsa.']);
        }

        // Mark OTP as verified
        $otpVerification->markAsVerified();

        // Create user with manager role and trial period
        $userData = $otpVerification->user_data;

        $user = User::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'phone' => $userData['phone'],
            'role' => 'manager',
            'password' => $userData['password'],
            'is_trial' => true,
            'trial_expired_at' => now()->addDays(7), // 7 days free trial
        ]);

        // Create default outlet for the manager
        $outlet = Outlet::create([
            'name' => $userData['business_name'],
            'code' => strtoupper(substr($userData['business_name'], 0, 3)) . rand(100, 999),
            'address' => 'Alamat outlet',
            'phone' => $userData['phone'],
            'is_active' => true,
            'super_admin_id' => $user->id,
        ]);

        // Update user with outlet_id
        $user->update(['outlet_id' => $outlet->id]);

        // Clean up OTP verification
        $otpVerification->delete();

        // Log in the user
        Auth::login($user);

        return redirect()->route('dashboard')->with('success', 'Registrasi berhasil! Anda mendapatkan free trial selama 7 hari.');
    }

    /**
     * Resend OTP
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $otpVerification = OtpVerification::where('phone', $request->phone)
            ->where('is_verified', false)
            ->first();

        if (!$otpVerification) {
            return back()->withErrors(['phone' => 'No pending OTP verification found.']);
        }

        // Generate new OTP
        $otpVerification->update([
            'otp_code' => OtpVerification::generateOtp(),
            'expires_at' => now()->addMinutes(5),
        ]);

        // Send new OTP
        $otpSent = $this->whatsappService->sendOtp($request->phone, $otpVerification->otp_code);

        if (!$otpSent) {
            return back()->withErrors(['phone' => 'Failed to resend OTP. Please try again.']);
        }

        return back()->with('success', 'Kode OTP baru telah dikirim ke WhatsApp Anda.');
    }
}
