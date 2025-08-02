import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Payment({ subscription, paymentToken, midtransClientKey }) {
    const isPaymentProcessed = useRef(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    useEffect(() => {
        if (isPaymentProcessed.current || !paymentToken || !midtransClientKey) return;

        // Load Midtrans Snap script
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', midtransClientKey);
        script.onload = () => {
            if (window.snap) {
                isPaymentProcessed.current = true;

                window.snap.pay(paymentToken, {
                    onSuccess: function(result) {
                        console.log('Payment success:', result);
                        window.location.href = route('subscription.success', {
                            order_id: result.order_id
                        });
                    },
                    onPending: function(result) {
                        console.log('Payment pending:', result);
                        window.location.href = route('subscription.pending', {
                            order_id: result.order_id
                        });
                    },
                    onError: function(result) {
                        console.log('Payment error:', result);
                        window.location.href = route('subscription.failed', {
                            order_id: result.order_id || 'unknown'
                        });
                    },
                    onClose: function() {
                        console.log('Payment popup closed');
                        window.location.href = route('subscription.index');
                    }
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [paymentToken, midtransClientKey]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-800">
                    Payment Processing
                </h2>
            }
        >
            <Head title="Payment Processing" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <h1 className="text-2xl font-bold mb-2">Memproses Pembayaran</h1>
                            <p className="text-blue-100">Mohon tunggu, sistem sedang menyiapkan pembayaran Anda...</p>
                        </div>

                        <div className="p-6">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Detail Langganan
                                </h2>
                            </div>

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
                                            {formatPrice(subscription.price)}
                                        </p>
                                        <p className="text-sm text-blue-600">/bulan</p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-200 pt-4">
                                    <h4 className="font-semibold text-blue-800 mb-3">Fitur yang Akan Aktif:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {subscription.features.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-blue-700 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a2 2 0 00-2-2H8a2 2 0 00-2 2v6h8z" />
                                    </svg>
                                    <span className="text-sm">Pembayaran diamankan oleh Midtrans</span>
                                </div>

                                <p className="text-sm text-gray-500 mb-6">
                                    Jika popup pembayaran tidak muncul, pastikan popup blocker dinonaktifkan
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            SSL Secured
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            PCI Compliant
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            Bank Grade Security
                                        </div>
                                    </div>

                                    <div className="flex justify-center space-x-4 pt-4">
                                        <img src="/images/payment/visa.png" alt="Visa" className="h-8 opacity-70" />
                                        <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-8 opacity-70" />
                                        <img src="/images/payment/bca.png" alt="BCA" className="h-8 opacity-70" />
                                        <img src="/images/payment/mandiri.png" alt="Mandiri" className="h-8 opacity-70" />
                                        <img src="/images/payment/bni.png" alt="BNI" className="h-8 opacity-70" />
                                        <img src="/images/payment/gopay.png" alt="GoPay" className="h-8 opacity-70" />
                                        <img src="/images/payment/dana.png" alt="DANA" className="h-8 opacity-70" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <a
                            href={route('subscription.index')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Pilihan Plan
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
