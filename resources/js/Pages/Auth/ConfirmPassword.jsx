import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi - TOKAKU" />

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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Area Aman</h2>
                <p className="text-gray-600 text-sm">
                    Ini adalah area aman dari aplikasi. Silakan konfirmasi
                    kata sandi Anda sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="tokaku-card p-8 rounded-2xl">
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Konfirmasi Kata Sandi
                    </label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                        isFocused={true}
                        placeholder="Masukkan kata sandi Anda"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-6">
                    <PrimaryButton
                        className="tokaku-button-primary w-full justify-center"
                        disabled={processing}
                    >
                        {processing ? 'Memverifikasi...' : 'Konfirmasi'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 tokaku-card p-6 rounded-xl">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-bold text-orange-700 mb-1">Keamanan Terjamin</h3>
                        <p className="text-sm text-gray-600">
                            Kami melindungi informasi sensitif Anda dengan verifikasi tambahan.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
