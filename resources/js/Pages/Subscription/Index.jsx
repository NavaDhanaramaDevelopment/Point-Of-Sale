import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ subscriptions, userSubscription, midtransClientKey }) {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleSubscribe = (subscription) => {
        if (userSubscription) {
            alert('Anda sudah memiliki langganan aktif!');
            return;
        }

        router.post(
            route('subscription.subscribe'),
            { subscription_id: subscription.id },
            {
                preserveState: true,
                onSuccess: (page) => {
                    // Jika backend mengembalikan inertia render Payment, Inertia akan handle
                    if (page.props && page.props.redirect) {
                        window.location.href = page.props.redirect;
                    }
                },
                onError: (errors) => {
                    // Tampilkan error validasi dari backend
                    if (errors && errors.subscription_id) {
                        alert(errors.subscription_id);
                    } else if (errors && errors.error) {
                        alert(errors.error);
                    } else {
                        alert('Terjadi kesalahan. Silakan coba lagi.');
                    }
                },
            }
        );
    };

    const getBadgeColor = (color) => {
        const colors = {
            gray: 'bg-gray-100 text-gray-800 border-gray-300',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            purple: 'bg-purple-100 text-purple-800 border-purple-300'
        };
        return colors[color] || colors.gray;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getFeatureDisplayName = (feature) => {
        const featureNames = {
            'basic_pos': 'POS Dasar',
            'advanced_pos': 'POS Lanjutan',
            'enterprise_pos': 'POS Enterprise',
            'inventory_basic': 'Inventori Dasar',
            'inventory_advanced': 'Inventori Lanjutan',
            'inventory_enterprise': 'Inventori Enterprise',
            'sales_report_basic': 'Laporan Penjualan Dasar',
            'sales_report_advanced': 'Laporan Penjualan Lanjutan',
            'sales_analytics': 'Analytics Penjualan',
            'customer_management': 'Manajemen Pelanggan',
            'customer_management_advanced': 'Manajemen Pelanggan Lanjutan',
            'supplier_management': 'Manajemen Supplier',
            'barcode_scanner': 'Barcode Scanner',
            'receipt_printer': 'Receipt Printer',
            'max_products_100': 'Maksimal 100 Produk',
            'max_products_1000': 'Maksimal 1.000 Produk',
            'unlimited_products': 'Produk Unlimited',
            'max_transactions_500': 'Maksimal 500 Transaksi/bulan',
            'max_transactions_5000': 'Maksimal 5.000 Transaksi/bulan',
            'unlimited_transactions': 'Transaksi Unlimited',
            'single_user': '1 User',
            'multi_user_5': 'Maksimal 5 User',
            'unlimited_users': 'User Unlimited',
            'multi_location': 'Multi Lokasi',
            'api_access': 'API Access',
            'custom_reports': 'Custom Reports',
            'backup_restore': 'Backup & Restore',
            'email_support': 'Email Support',
            'priority_support': 'Priority Support',
            'whatsapp_integration': 'WhatsApp Integration'
        };
        return featureNames[feature] || feature;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-blue-800">
                        Subscription Plans
                    </h2>
                    {userSubscription && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-600">Langganan Aktif:</span>
                            <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                                {userSubscription.subscription.name}
                            </span>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Subscription Plans" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {userSubscription && (
                        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                                        Langganan Aktif: {userSubscription.subscription.name}
                                    </h3>
                                    <p className="text-green-600 text-sm mb-4">
                                        Berlaku hingga: {new Date(userSubscription.expired_at).toLocaleDateString('id-ID')}
                                    </p>
                                    <p className="text-green-600 text-sm">
                                        Sisa waktu: {userSubscription.days_remaining} hari
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-800">
                                        {formatPrice(userSubscription.subscription.price)}
                                    </p>
                                    <p className="text-sm text-green-600">/bulan</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {subscriptions.map((subscription) => (
                            <div
                                key={subscription.id}
                                className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                                    subscription.name === 'Gold'
                                        ? 'border-yellow-300 transform scale-105'
                                        : 'border-blue-100 hover:border-blue-300'
                                }`}
                            >
                                {subscription.name === 'Gold' && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="flex items-center justify-center mb-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getBadgeColor(subscription.badge_color)}`}>
                                                {subscription.name}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-4xl font-bold text-blue-800">
                                                {formatPrice(subscription.price)}
                                            </span>
                                            <span className="text-blue-600 text-lg">/bulan</span>
                                        </div>

                                        <p className="text-gray-600 text-sm">
                                            {subscription.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {subscription.features.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 text-sm">
                                                    {getFeatureDisplayName(feature)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleSubscribe(subscription)}
                                        disabled={userSubscription && userSubscription.subscription_id === subscription.id}
                                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                                            userSubscription && userSubscription.subscription_id === subscription.id
                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                : subscription.name === 'Gold'
                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        {userSubscription && userSubscription.subscription_id === subscription.id
                                            ? 'Langganan Aktif'
                                            : userSubscription
                                            ? 'Upgrade Plan'
                                            : 'Pilih Plan'
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                💡 Mengapa Berlangganan?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-blue-800 mb-2">Fitur Lengkap</h4>
                                    <p className="text-blue-600">Akses semua fitur POS sesuai dengan plan yang dipilih</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-blue-800 mb-2">Support 24/7</h4>
                                    <p className="text-blue-600">Dukungan teknis dan bantuan kapan saja Anda butuhkan</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-blue-800 mb-2">Data Aman</h4>
                                    <p className="text-blue-600">Backup otomatis dan keamanan data terjamin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
