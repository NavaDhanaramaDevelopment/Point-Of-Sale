import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Kata Sandi - TOKAKU" />

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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Buat Kata Sandi Baru</h2>
                <p className="text-gray-600 text-sm">
                    Masukkan kata sandi baru Anda untuk melanjutkan
                </p>
            </div>

            <form onSubmit={submit} className="tokaku-card p-8 rounded-2xl space-y-6">
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
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        readOnly
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Kata Sandi Baru
                    </label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="new-password"
                        isFocused={true}
                        placeholder="Masukkan kata sandi baru"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                        Konfirmasi Kata Sandi
                    </label>
                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="new-password"
                        placeholder="Ulangi kata sandi baru"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <PrimaryButton
                        className="tokaku-button-primary w-full justify-center"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 tokaku-card p-6 rounded-xl">
                <h3 className="font-bold text-orange-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    Tips Kata Sandi Aman:
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Gunakan minimal 8 karakter
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Kombinasi huruf besar, kecil, dan angka
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Tambahkan simbol khusus (!, @, #, dll)
                    </li>
                </ul>
            </div>
        </GuestLayout>
    );
}
