import { Head, Link } from '@inertiajs/react';
import PosRetailLogo from '@/Components/PosRetailLogo';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to TOKAKU - Aplikasi Toko Kasir Ku" />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-orange-300/40 rounded-full blur-lg animate-bounce"></div>
                    <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-orange-200/20 rounded-full blur-md float-animation"></div>
                    <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-yellow-300/25 rounded-full blur-sm animate-ping"></div>

                    {/* Floating sparkles */}
                    <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
                </div>

                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-6xl px-6">
                        <header className="flex justify-end py-10">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="tokaku-button-primary px-8 py-4 rounded-xl font-bold text-white transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5v4"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 5v4"/>
                                    </svg>
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <div className="space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl px-8 py-4 text-orange-600 border-2 border-orange-200 bg-white/80 backdrop-blur-sm hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 font-bold transform hover:scale-105"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="tokaku-button-primary px-8 py-4 rounded-xl text-white font-bold transform hover:scale-105 transition-all duration-200 shadow-lg"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </header>

                        <main className="text-center">
                            <div className="flex justify-center mb-12">
                                <div className="logo-glow">
                                    <PosRetailLogo className="h-32 w-auto" />
                                </div>
                            </div>

                            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
                                TOKAKU
                            </h1>

                            <h2 className="text-2xl font-semibold text-orange-700 mb-8">
                                Aplikasi Toko Kasir Ku
                            </h2>

                            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Sistem Point of Sale modern untuk toko retail dengan interface yang mudah digunakan,
                                fitur manajemen yang lengkap, dan desain yang menarik untuk kemudahan bisnis Anda.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                                <div className="tokaku-card p-8 rounded-2xl transform hover:scale-105 transition-all duration-300 group">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Transaksi Mudah</h3>
                                    <p className="text-gray-600 leading-relaxed">Interface kasir yang intuitif dengan barcode scanner untuk proses transaksi yang cepat, akurat, dan mudah dipahami.</p>
                                </div>

                                <div className="tokaku-card p-8 rounded-2xl transform hover:scale-105 transition-all duration-300 group">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Manajemen Stok</h3>
                                    <p className="text-gray-600 leading-relaxed">Kelola inventori, produk, dan kategori dengan sistem tracking yang akurat dan laporan pergerakan stok real-time.</p>
                                </div>

                                <div className="tokaku-card p-8 rounded-2xl transform hover:scale-105 transition-all duration-300 group">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Laporan Lengkap</h3>
                                    <p className="text-gray-600 leading-relaxed">Dashboard analitik dan laporan penjualan komprehensif dengan grafik interaktif untuk insight bisnis yang mendalam.</p>
                                </div>
                            </div>

                            <div className="mt-16">
                                <div className="tokaku-card p-10 rounded-2xl max-w-4xl mx-auto">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mr-3"></div>
                                        Sistem Multi-Role
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-red-700 text-sm">Admin</span>
                                            <p className="text-xs text-red-600 mt-1">Full Access</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-blue-700 text-sm">Manager</span>
                                            <p className="text-xs text-blue-600 mt-1">Store Management</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-green-700 text-sm">Kasir</span>
                                            <p className="text-xs text-green-600 mt-1">POS Operations</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-purple-700 text-sm">Owner</span>
                                            <p className="text-xs text-purple-600 mt-1">Business Oversight</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="text-center mt-16 py-8">
                            <p className="text-orange-600 font-medium">
                                Built with ❤️ using Laravel, React, and Inertia.js
                            </p>
                            <p className="text-orange-500 text-sm mt-2">
                                © 2025 TOKAKU - Aplikasi Toko Kasir Ku
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
