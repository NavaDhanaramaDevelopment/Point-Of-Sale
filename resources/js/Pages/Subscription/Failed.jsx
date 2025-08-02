import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Failed({ transaction, subscription, error }) {
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getErrorMessage = (errorCode) => {
        const errorMessages = {
            '400': 'Data transaksi tidak valid',
            '401': 'Unauthorized access',
            '402': 'Dana tidak mencukupi',
            '403': 'Transaksi ditolak oleh bank',
            '404': 'Metode pembayaran tidak ditemukan',
            '407': 'Transaksi expired',
            '408': 'Timeout transaksi',
            '410': 'Merchant tidak aktif',
            '411': 'Token tidak valid',
            '412': 'Merchant tidak ditemukan',
            '413': 'Invalid authentication',
            '500': 'Terjadi kesalahan pada server',
            '501': 'Feature tidak tersedia',
            '502': 'Bad gateway',
            '503': 'Service tidak tersedia'
        };
        return errorMessages[errorCode] || 'Transaksi gagal diproses';
    };

    const handleRetryPayment = () => {
        if (subscription) {
            window.location.href = route('subscription.subscribe', {
                subscription_id: subscription.id
            });
        } else {
            window.location.href = route('subscription.index');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-800">
                    Payment Failed
                </h2>
            }
        >
            <Head title="Payment Failed" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Error Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-white text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Pembayaran Gagal</h1>
                            <p className="text-red-100">
                                {error ? getErrorMessage(error) : 'Maaf, terjadi kesalahan saat memproses pembayaran Anda'}
                            </p>
                        </div>

                        {/* Error Details */}
                        <div className="p-6">
                            {transaction && (
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                        Detail Transaksi
                                    </h2>
                                    <p className="text-gray-600">
                                        Order ID: <span className="font-mono text-red-600">{transaction.order_id}</span>
                                    </p>
                                </div>
                            )}

                            {/* Subscription Info */}
                            {subscription && (
                                <div className="bg-red-50 rounded-lg p-6 border border-red-200 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-red-800">
                                                {subscription.name} Plan
                                            </h3>
                                            <p className="text-red-600 text-sm">
                                                Pembayaran untuk langganan bulanan
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-red-800">
                                                {formatPrice(subscription.price)}
                                            </p>
                                            <p className="text-sm text-red-600">/bulan</p>
                                        </div>
                                    </div>

                                    {transaction && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-red-200 pt-4">
                                            <div>
                                                <span className="text-gray-600">Waktu Transaksi:</span>
                                                <p className="font-semibold text-gray-800">
                                                    {formatDate(transaction.transaction_time)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Status:</span>
                                                <p className="font-semibold text-red-600 capitalize">
                                                    {transaction.transaction_status || 'Failed'}
                                                </p>
                                            </div>
                                            {transaction.payment_type && (
                                                <div>
                                                    <span className="text-gray-600">Metode Pembayaran:</span>
                                                    <p className="font-semibold text-gray-800 capitalize">
                                                        {transaction.payment_type}
                                                    </p>
                                                </div>
                                            )}
                                            {transaction.transaction_id && (
                                                <div>
                                                    <span className="text-gray-600">Transaction ID:</span>
                                                    <p className="font-mono text-sm text-gray-800">
                                                        {transaction.transaction_id}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Common Reasons */}
                            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mb-6">
                                <h4 className="font-semibold text-yellow-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 8.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Kemungkinan Penyebab:
                                </h4>
                                <ul className="space-y-2 text-yellow-700 text-sm">
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Saldo atau limit kartu kredit/debit tidak mencukupi</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Koneksi internet terputus saat proses pembayaran</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Data kartu atau informasi pembayaran tidak valid</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Transaksi ditolak oleh bank penerbit kartu</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Sesi pembayaran telah expired atau timeout</span>
                                    </li>
                                </ul>
                            </div>

                            {/* What to do next */}
                            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
                                <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Yang Dapat Anda Lakukan:
                                </h4>
                                <ul className="space-y-2 text-blue-700 text-sm">
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">1.</span>
                                        <span>Periksa saldo atau limit kartu kredit/debit Anda</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">2.</span>
                                        <span>Pastikan koneksi internet stabil</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">3.</span>
                                        <span>Coba menggunakan metode pembayaran yang berbeda</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">4.</span>
                                        <span>Hubungi bank Anda jika masalah berlanjut</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">5.</span>
                                        <span>Atau hubungi tim support kami untuk bantuan</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleRetryPayment}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Coba Lagi
                                </button>

                                <a
                                    href={route('subscription.index')}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg border border-blue-300 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Pilih Plan Lain
                                </a>

                                <a
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                    </svg>
                                    Kembali ke Dashboard
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="mt-8 text-center">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Butuh Bantuan?
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Tim support kami siap membantu Anda menyelesaikan masalah pembayaran
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-800">Email Support</h4>
                                    <p className="text-gray-600">support@posretail.com</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-800">Phone Support</h4>
                                    <p className="text-gray-600">+62 21 1234 5678</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-800">Live Chat</h4>
                                    <p className="text-gray-600">24/7 Available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
