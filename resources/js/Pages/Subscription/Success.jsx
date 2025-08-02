import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Success({ transaction, subscription }) {
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-800">
                    Payment Successful
                </h2>
            }
        >
            <Head title="Payment Successful" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Pembayaran Berhasil!</h1>
                            <p className="text-green-100">Selamat! Langganan Anda telah aktif dan siap digunakan</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="p-6">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    Detail Transaksi
                                </h2>
                                <p className="text-gray-600">
                                    Order ID: <span className="font-mono text-blue-600">{transaction.order_id}</span>
                                </p>
                            </div>

                            {/* Subscription Info */}
                            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-800">
                                            {subscription.name} Plan
                                        </h3>
                                        <p className="text-blue-600 text-sm">
                                            Langganan bulanan dengan fitur lengkap
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-800">
                                            {formatPrice(transaction.gross_amount)}
                                        </p>
                                        <p className="text-sm text-blue-600">/bulan</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Tanggal Transaksi:</span>
                                        <p className="font-semibold text-gray-800">
                                            {formatDate(transaction.transaction_time)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Status:</span>
                                        <p className="font-semibold text-green-600">
                                            {transaction.transaction_status === 'capture' ? 'Berhasil' : transaction.transaction_status}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Metode Pembayaran:</span>
                                        <p className="font-semibold text-gray-800 capitalize">
                                            {transaction.payment_type}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Transaction ID:</span>
                                        <p className="font-mono text-sm text-gray-800">
                                            {transaction.transaction_id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Fitur yang Telah Aktif:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {subscription.features.map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mb-6">
                                <h4 className="font-semibold text-yellow-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Langkah Selanjutnya:
                                </h4>
                                <ul className="space-y-2 text-yellow-700 text-sm">
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">1.</span>
                                        <span>Fitur-fitur premium Anda sudah aktif dan dapat digunakan segera</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">2.</span>
                                        <span>Simpan bukti transaksi ini untuk referensi di masa mendatang</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">3.</span>
                                        <span>Jika ada pertanyaan, hubungi tim support kami kapan saja</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">4.</span>
                                        <span>Langganan akan diperpanjang otomatis setiap bulan</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                    </svg>
                                    Kembali ke Dashboard
                                </a>

                                <a
                                    href={route('subscription.index')}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg border border-blue-300 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Lihat Subscription
                                </a>

                                <button
                                    onClick={() => window.print()}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="mt-8 text-center">
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                Butuh Bantuan?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-blue-800">Email Support</h4>
                                    <p className="text-blue-600">support@posretail.com</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-blue-800">Phone Support</h4>
                                    <p className="text-blue-600">+62 21 1234 5678</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-blue-800">Live Chat</h4>
                                    <p className="text-blue-600">24/7 Available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
