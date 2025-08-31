import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi - TOKAKU" />

            {/* TOKAKU Logo */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-3">
                    <img
                        src="/logo.png"
                        alt="TOKAKU Logo"
                        className="h-16 w-16 drop-shadow-lg"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div className="hidden text-4xl font-bold text-orange-600 drop-shadow-lg animate-pulse">
                        <span className="text-orange-500">T</span>
                        <span className="text-yellow-500">O</span>
                        <span className="text-orange-600">K</span>
                        <span className="text-yellow-600">A</span>
                        <span className="text-orange-500">K</span>
                        <span className="text-yellow-500">U</span>
                    </div>
                </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Lupa Kata Sandi?</h2>
                <p className="text-gray-600 text-sm">
                    Tidak masalah! Masukkan email Anda dan kami akan mengirim
                    tautan reset kata sandi yang baru.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-700 text-center">
                    <div className="flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Berhasil Dikirim!
                    </div>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="tokaku-card p-8 rounded-2xl">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Alamat Email
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                        isFocused={true}
                        placeholder="Masukkan email Anda"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-6">
                    <PrimaryButton
                        className="tokaku-button-primary w-full justify-center"
                        disabled={processing}
                    >
                        {processing ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href={route('login')}
                    className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Kembali ke Halaman Masuk
                </Link>
            </div>
        </GuestLayout>
    );
}
