import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email - TOKAKU" />

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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi Email Anda</h2>
                <p className="text-gray-600 text-sm">
                    Terima kasih telah mendaftar! Sebelum memulai, bisakah Anda
                    memverifikasi alamat email dengan mengklik tautan yang baru saja
                    kami kirimkan kepada Anda?
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-700 text-center">
                    <div className="flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Email Verifikasi Terkirim!
                    </div>
                    Tautan verifikasi baru telah dikirim ke alamat email yang
                    Anda berikan saat pendaftaran.
                </div>
            )}

            <div className="tokaku-card p-8 rounded-2xl">
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Cek Email Anda</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Jika Anda tidak menerima email, kami dengan senang hati akan
                        mengirimkan email lain untuk Anda.
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <PrimaryButton
                            className="tokaku-button-primary w-full justify-center"
                            disabled={processing}
                        >
                            {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                        </PrimaryButton>

                        <div className="text-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                Keluar
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            <div className="mt-8 tokaku-card p-6 rounded-xl">
                <h3 className="font-bold text-orange-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    Tips Verifikasi Email:
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Periksa folder inbox dan spam/junk
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Email mungkin memerlukan beberapa menit untuk tiba
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                        Klik tautan dalam email untuk mengaktifkan akun
                    </li>
                </ul>
            </div>
        </GuestLayout>
    );
}
