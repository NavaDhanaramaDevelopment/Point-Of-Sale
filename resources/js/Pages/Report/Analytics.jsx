import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Analytics({
    auth,
    todaySales,
    salesGrowth,
    todayTransactions,
    transactionGrowth,
    topProducts,
    salesTrend,
    kasirPerformance
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analytics & Dashboard</h2>}
        >
            <Head title="Analytics & Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Penjualan Hari Ini</p>
                                        <p className="text-2xl font-bold">{formatCurrency(todaySales)}</p>
                                        <div className="flex items-center mt-2">
                                            <span className={`text-sm ${salesGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                                                {salesGrowth >= 0 ? '↗' : '↘'} {Math.abs(salesGrowth)}% vs kemarin
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-blue-200">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Transaksi Hari Ini</p>
                                        <p className="text-2xl font-bold">{todayTransactions}</p>
                                        <div className="flex items-center mt-2">
                                            <span className={`text-sm ${transactionGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                                                {transactionGrowth >= 0 ? '↗' : '↘'} {Math.abs(transactionGrowth)}% vs kemarin
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-green-200">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Rata-rata Transaksi</p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(todayTransactions > 0 ? todaySales / todayTransactions : 0)}
                                        </p>
                                        <p className="text-purple-200 text-sm mt-2">Per transaksi</p>
                                    </div>
                                    <div className="text-purple-200">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm">Kasir Aktif</p>
                                        <p className="text-2xl font-bold">{kasirPerformance.length}</p>
                                        <p className="text-orange-200 text-sm mt-2">Total kasir</p>
                                    </div>
                                    <div className="text-orange-200">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Sales Trend */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Trend Penjualan (30 Hari)</h3>
                                <div className="h-64 flex items-end justify-between space-x-1">
                                    {salesTrend.map((item, index) => {
                                        const maxValue = Math.max(...salesTrend.map(s => s.total));
                                        const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;

                                        return (
                                            <div
                                                key={index}
                                                className="bg-blue-500 rounded-t min-w-0 flex-1 transition-all duration-200 hover:bg-blue-600"
                                                style={{ height: `${height}%` }}
                                                title={`${formatDate(item.date)}: ${formatCurrency(item.total)}`}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>30 hari lalu</span>
                                    <span>Hari ini</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Produk Terlaris (7 Hari)</h3>
                                <div className="space-y-3">
                                    {topProducts.slice(0, 5).map((product, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.total_quantity} terjual</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">{formatCurrency(product.total_revenue)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kasir Performance */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Kasir (30 Hari)</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kasir
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Penjualan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Transaksi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rata-rata Transaksi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Performance
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {kasirPerformance.map((kasir, index) => {
                                            const avgTransaction = kasir.sales_count > 0 ? kasir.sales_sum_total_amount / kasir.sales_count : 0;
                                            const totalSales = kasir.sales_sum_total_amount || 0;
                                            const totalTransactions = kasir.sales_count || 0;
                                            const maxSales = Math.max(...kasirPerformance.map(k => k.sales_sum_total_amount || 0));
                                            const performancePercent = maxSales > 0 ? (totalSales / maxSales) * 100 : 0;

                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {kasir.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(totalSales)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {totalTransactions}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(avgTransaction)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full"
                                                                    style={{ width: `${performancePercent}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs">{Math.round(performancePercent)}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
