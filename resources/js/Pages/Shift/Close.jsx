import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Close({ auth, shift, expected_balance }) {
    const { data, setData, post, processing, errors } = useForm({
        closing_balance: '',
        closing_notes: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('shifts.close', shift.id));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('id-ID');
    };

    const calculateDifference = () => {
        if (data.closing_balance && expected_balance) {
            return parseFloat(data.closing_balance) - expected_balance;
        }
        return 0;
    };

    const difference = calculateDifference();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tutup Shift</h2>}
        >
            <Head title="Tutup Shift" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-6">Tutup Shift Kasir</h3>

                            {/* Ringkasan Shift */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <h4 className="font-medium text-gray-800 mb-4">Ringkasan Shift</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Kasir</p>
                                        <p className="font-medium">{auth.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Mulai Shift</p>
                                        <p className="font-medium">{formatDateTime(shift.started_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Modal Awal</p>
                                        <p className="font-medium">{formatCurrency(shift.opening_balance)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Transaksi</p>
                                        <p className="font-medium">{shift.total_transactions}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Penjualan Tunai</p>
                                        <p className="font-medium text-green-600">{formatCurrency(shift.cash_sales)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Penjualan Non-Tunai</p>
                                        <p className="font-medium text-blue-600">{formatCurrency(shift.non_cash_sales)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Penjualan</p>
                                        <p className="font-medium text-purple-600">{formatCurrency(shift.cash_sales + shift.non_cash_sales)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Tutup Shift */}
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Saldo Akhir (Uang Tunai di Kasir)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.closing_balance}
                                            onChange={(e) => setData('closing_balance', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Masukkan saldo akhir"
                                            min="0"
                                            step="1000"
                                            required
                                        />
                                        {errors.closing_balance && (
                                            <p className="text-red-500 text-xs italic mt-1">{errors.closing_balance}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Saldo Yang Diharapkan
                                        </label>
                                        <input
                                            type="text"
                                            value={formatCurrency(expected_balance)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
                                            readOnly
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Modal Awal + Penjualan Tunai
                                        </p>
                                    </div>
                                </div>

                                {/* Selisih */}
                                {data.closing_balance && (
                                    <div className="mb-6">
                                        <div className={`p-4 rounded-lg ${
                                            difference === 0
                                                ? 'bg-green-50 border border-green-200'
                                                : difference > 0
                                                    ? 'bg-blue-50 border border-blue-200'
                                                    : 'bg-red-50 border border-red-200'
                                        }`}>
                                            <h4 className={`font-medium mb-2 ${
                                                difference === 0
                                                    ? 'text-green-800'
                                                    : difference > 0
                                                        ? 'text-blue-800'
                                                        : 'text-red-800'
                                            }`}>
                                                Selisih Kas
                                            </h4>
                                            <p className={`text-lg font-bold ${
                                                difference === 0
                                                    ? 'text-green-600'
                                                    : difference > 0
                                                        ? 'text-blue-600'
                                                        : 'text-red-600'
                                            }`}>
                                                {formatCurrency(Math.abs(difference))}
                                                {difference > 0 && ' (Lebih)'}
                                                {difference < 0 && ' (Kurang)'}
                                                {difference === 0 && ' (Pas)'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Catatan Penutupan (Opsional)
                                    </label>
                                    <textarea
                                        value={data.closing_notes}
                                        onChange={(e) => setData('closing_notes', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                                        placeholder="Catatan penutupan shift, termasuk penjelasan selisih jika ada..."
                                    />
                                    {errors.closing_notes && (
                                        <p className="text-red-500 text-xs italic mt-1">{errors.closing_notes}</p>
                                    )}
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-medium text-yellow-800 mb-2">Peringatan:</h4>
                                    <ul className="text-yellow-700 text-sm space-y-1">
                                        <li>• Pastikan telah menghitung uang tunai di kasir dengan benar</li>
                                        <li>• Shift yang sudah ditutup tidak dapat dibuka kembali</li>
                                        <li>• Jika ada selisih, berikan penjelasan di catatan penutupan</li>
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between">
                                    <a
                                        href={route('shifts.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Batal
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                    >
                                        {processing ? 'Menutup...' : 'Tutup Shift'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
