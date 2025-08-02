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
            <Head title="Verifikasi OTP" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi OTP</h1>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">
                    Kode dikirim ke: <span className="font-semibold">{phone}</span>
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="otp_code" value="Kode OTP (6 digit)" />

                    <TextInput
                        id="otp_code"
                        name="otp_code"
                        type="text"
                        value={data.otp_code}
                        className="mt-1 block w-full text-center text-2xl tracking-widest"
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
                        className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
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
                        className="w-full justify-center"
                        disabled={processing || data.otp_code.length !== 6}
                    >
                        {processing ? 'Memverifikasi...' : 'Verifikasi & Daftar'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Tips:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Kode OTP berlaku selama 5 menit</li>
                    <li>• Pastikan WhatsApp Anda aktif</li>
                    <li>• Cek juga folder spam/pesan tersaring</li>
                </ul>
            </div>
        </GuestLayout>
    );
}
