import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function VerifyOtp({ phone, message }) {
    const [resendCooldown, setResendCooldown] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        phone: phone,
        otp_code: '',
    });

    const { post: resendPost, processing: resendProcessing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route('register.verify-otp'));
    };

    const resendOtp = () => {
        if (resendCooldown > 0) return;

        resendPost(route('register.resend-otp'), {
            data: { phone },
            onSuccess: () => {
                setResendCooldown(60);
                const countdown = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(countdown);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi OTP - TOKAKU" />

            <div className="mb-8 text-center">
                <div className="flex justify-center mb-6">
                    <img
                        src="/logo.png"
                        alt="TOKAKU"
                        className="w-20 h-20 object-contain drop-shadow-lg"
                    />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">Verifikasi OTP</h1>
                <p className="text-orange-600 font-medium mb-4">{message}</p>
                <div className="tokaku-card inline-block px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Kode dikirim ke: <span className="font-bold text-orange-600">{phone}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="otp_code" value="Kode OTP (6 digit)" />

                    <TextInput
                        id="otp_code"
                        name="otp_code"
                        type="text"
                        value={data.otp_code}
                        className="mt-1 block w-full text-center text-3xl tracking-widest font-bold text-orange-600 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        maxLength="6"
                        placeholder="000000"
                        isFocused={true}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ''); // Only numbers
                            setData('otp_code', value);
                        }}
                        required
                    />

                    <InputError message={errors.otp_code} className="mt-2" />
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">
                        Tidak menerima kode?
                    </p>

                    <button
                        type="button"
                        onClick={resendOtp}
                        disabled={resendCooldown > 0 || resendProcessing}
                        className="text-orange-600 hover:text-orange-800 font-bold disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {resendCooldown > 0
                            ? `Kirim ulang dalam ${resendCooldown}s`
                            : resendProcessing
                                ? 'Mengirim...'
                                : 'Kirim ulang OTP'
                        }
                    </button>
                </div>

                <div className="mt-6">
                    <PrimaryButton
                        className="tokaku-button-primary w-full justify-center"
                        disabled={processing || data.otp_code.length !== 6}
                    >
                        {processing ? 'Memverifikasi...' : 'Verifikasi & Daftar'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 tokaku-card p-6 rounded-xl">
                <h3 className="font-bold text-orange-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    Tips Verifikasi:
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Kode OTP berlaku selama 5 menit
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        Pastikan WhatsApp Anda aktif
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                        </svg>
                        Cek juga folder spam/pesan tersaring
                    </li>
                </ul>
            </div>
        </GuestLayout>
    );
}
