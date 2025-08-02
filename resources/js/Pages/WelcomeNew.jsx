import { Head, Link } from '@inertiajs/react';
import PosRetailLogo from '@/Components/PosRetailLogo';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to POS Retail" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-4xl px-6">
                        <header className="flex justify-end py-10">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-6 py-3 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out font-semibold"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-6 py-3 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out font-semibold"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out font-semibold"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </header>

                        <main className="text-center">
                            <div className="flex justify-center mb-8">
                                <PosRetailLogo className="h-24 w-auto" />
                            </div>

                            <h1 className="text-5xl font-bold text-blue-800 mb-6">
                                POS Retail System
                            </h1>

                            <p className="text-xl text-blue-600 mb-8 max-w-2xl mx-auto">
                                Sistem Point of Sale modern untuk retail dengan interface yang intuitif
                                dan fitur manajemen yang lengkap.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Easy Transactions</h3>
                                    <p className="text-blue-600 text-sm">Interface kasir yang mudah digunakan untuk proses transaksi yang cepat dan akurat.</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Inventory Management</h3>
                                    <p className="text-blue-600 text-sm">Kelola stok produk, kategori, dan inventori dengan sistem yang terintegrasi.</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Real-time Reports</h3>
                                    <p className="text-blue-600 text-sm">Laporan penjualan dan analitik real-time untuk membantu pengambilan keputusan bisnis.</p>
                                </div>
                            </div>

                            <div className="mt-12">
                                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 max-w-2xl mx-auto">
                                    <h3 className="text-xl font-semibold text-blue-800 mb-4">Role-based Access</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className="w-3 h-3 bg-red-100 border border-red-300 rounded-full flex items-center justify-center">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                            </span>
                                            <span className="text-blue-700">Admin: Full Access</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center">
                                                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                            </span>
                                            <span className="text-blue-700">Manager: Operations</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="w-3 h-3 bg-green-100 border border-green-300 rounded-full flex items-center justify-center">
                                                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                            </span>
                                            <span className="text-blue-700">Kasir: POS Only</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="text-center mt-16 py-8">
                            <p className="text-blue-500 text-sm">
                                Built with Laravel, React, and Inertia.js
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
