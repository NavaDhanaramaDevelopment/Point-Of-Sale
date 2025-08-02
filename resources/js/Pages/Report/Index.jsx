import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth }) {
    const reportMenus = [
        {
            title: 'Laporan Penjualan',
            description: 'Laporan penjualan harian, mingguan, dan bulanan',
            icon: '📊',
            route: 'reports.sales',
            color: 'bg-blue-100 text-blue-800'
        },
        {
            title: 'Laporan Produk',
            description: 'Analisis penjualan per produk dan kategori',
            icon: '📦',
            route: 'reports.products',
            color: 'bg-green-100 text-green-800'
        },
        {
            title: 'Analytics & Dashboard',
            description: 'Dashboard analitik dan trend penjualan',
            icon: '📈',
            route: 'reports.analytics',
            color: 'bg-purple-100 text-purple-800'
        },
        {
            title: 'Laporan Kasir',
            description: 'Performance dan aktivitas kasir',
            icon: '👤',
            route: 'reports.kasir',
            color: 'bg-orange-100 text-orange-800'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan & Analitik</h2>}
        >
            <Head title="Laporan & Analitik" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Menu Laporan</h3>
                                <p className="text-gray-600">Pilih jenis laporan yang ingin Anda lihat</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {reportMenus.map((menu, index) => (
                                    <Link
                                        key={index}
                                        href={route(menu.route)}
                                        className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-lg ${menu.color} text-2xl`}>
                                                {menu.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {menu.title}
                                                </h4>
                                                <p className="text-gray-600 text-sm">
                                                    {menu.description}
                                                </p>
                                            </div>
                                            <div className="text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Ringkasan Hari Ini</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-blue-100 text-sm">Total Penjualan</p>
                                                <p className="text-2xl font-bold">Rp 0</p>
                                            </div>
                                            <div className="text-blue-200">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-green-100 text-sm">Total Transaksi</p>
                                                <p className="text-2xl font-bold">0</p>
                                            </div>
                                            <div className="text-green-200">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-purple-100 text-sm">Rata-rata Transaksi</p>
                                                <p className="text-2xl font-bold">Rp 0</p>
                                            </div>
                                            <div className="text-purple-200">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-orange-100 text-sm">Shift Aktif</p>
                                                <p className="text-2xl font-bold">0</p>
                                            </div>
                                            <div className="text-orange-200">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
