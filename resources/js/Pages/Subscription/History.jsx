import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function History({ userSubscriptions, currentSubscription }) {
    const [filter, setFilter] = useState('all');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'active': {
                color: 'bg-green-100 text-green-800 border-green-300',
                text: 'Aktif'
            },
            'expired': {
                color: 'bg-red-100 text-red-800 border-red-300',
                text: 'Expired'
            },
            'cancelled': {
                color: 'bg-gray-100 text-gray-800 border-gray-300',
                text: 'Dibatalkan'
            },
            'pending': {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                text: 'Pending'
            }
        };

        const config = statusConfig[status] || statusConfig['pending'];

        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            'paid': {
                color: 'bg-green-100 text-green-800',
                text: 'Lunas'
            },
            'pending': {
                color: 'bg-yellow-100 text-yellow-800',
                text: 'Pending'
            },
            'failed': {
                color: 'bg-red-100 text-red-800',
                text: 'Gagal'
            },
            'cancelled': {
                color: 'bg-gray-100 text-gray-800',
                text: 'Dibatalkan'
            }
        };

        const config = statusConfig[status] || statusConfig['pending'];

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const filteredSubscriptions = userSubscriptions.filter(subscription => {
        if (filter === 'all') return true;
        if (filter === 'active') return subscription.status === 'active';
        if (filter === 'expired') return subscription.status === 'expired';
        if (filter === 'cancelled') return subscription.status === 'cancelled';
        return true;
    });

    const handleRenewSubscription = (subscriptionId) => {
        window.location.href = route('subscription.subscribe', {
            subscription_id: subscriptionId
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-blue-800">
                        Riwayat Subscription
                    </h2>
                    {currentSubscription && (
                        <a
                            href={route('subscription.index')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Upgrade Plan
                        </a>
                    )}
                </div>
            }
        >
            <Head title="Subscription History" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Current Subscription */}
                    {currentSubscription && (
                        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">
                                            Langganan Aktif
                                        </h3>
                                        <p className="text-blue-100 mb-4">
                                            {currentSubscription.subscription.name} Plan
                                        </p>
                                        <div className="flex items-center space-x-6 text-sm">
                                            <div>
                                                <span className="text-blue-200">Berlaku hingga:</span>
                                                <p className="font-semibold">
                                                    {formatDate(currentSubscription.expired_at)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-blue-200">Sisa waktu:</span>
                                                <p className="font-semibold">
                                                    {currentSubscription.days_remaining} hari
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold mb-2">
                                            {formatPrice(currentSubscription.subscription.price)}
                                        </p>
                                        <p className="text-blue-200">/bulan</p>
                                        <div className="mt-4">
                                            {getStatusBadge(currentSubscription.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Riwayat Subscription
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            filter === 'all'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        onClick={() => setFilter('active')}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            filter === 'active'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        onClick={() => setFilter('expired')}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            filter === 'expired'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Expired
                                    </button>
                                    <button
                                        onClick={() => setFilter('cancelled')}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            filter === 'cancelled'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Dibatalkan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription List */}
                    <div className="space-y-4">
                        {filteredSubscriptions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Belum Ada Riwayat Subscription
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Anda belum memiliki riwayat subscription untuk filter yang dipilih
                                </p>
                                <a
                                    href={route('subscription.index')}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Pilih Plan Subscription
                                </a>
                            </div>
                        ) : (
                            filteredSubscriptions.map((userSubscription) => (
                                <div key={userSubscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {userSubscription.subscription.name} Plan
                                                    </h3>
                                                    {getStatusBadge(userSubscription.status)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                                    <div>
                                                        <span className="font-medium">Mulai:</span>
                                                        <p>{formatDate(userSubscription.started_at)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Berakhir:</span>
                                                        <p>{formatDate(userSubscription.expired_at)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Order ID:</span>
                                                        <p className="font-mono text-xs">{userSubscription.midtrans_order_id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Payment:</span>
                                                        <p>{getPaymentStatusBadge(userSubscription.payment_status)}</p>
                                                    </div>
                                                </div>

                                                {userSubscription.subscription.features && (
                                                    <div className="mb-4">
                                                        <span className="text-sm font-medium text-gray-700 mb-2 block">Fitur:</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {userSubscription.subscription.features.slice(0, 3).map((feature, index) => (
                                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                            {userSubscription.subscription.features.length > 3 && (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                    +{userSubscription.subscription.features.length - 3} lainnya
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-right ml-6">
                                                <p className="text-2xl font-bold text-gray-800 mb-1">
                                                    {formatPrice(userSubscription.subscription.price)}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-4">/bulan</p>

                                                {userSubscription.status === 'expired' && (
                                                    <button
                                                        onClick={() => handleRenewSubscription(userSubscription.subscription_id)}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Perpanjang
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Summary Stats */}
                    {userSubscriptions.length > 0 && (
                        <div className="mt-8 bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {userSubscriptions.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Subscription</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {userSubscriptions.filter(s => s.status === 'active').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Aktif</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {userSubscriptions.filter(s => s.status === 'expired').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Expired</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatPrice(userSubscriptions.reduce((total, s) => total + s.subscription.price, 0))}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Spending</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
