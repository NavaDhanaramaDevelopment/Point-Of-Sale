import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Open({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        opening_balance: '',
        opening_notes: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('shifts.open'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buka Shift</h2>}
        >
            <Head title="Buka Shift" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-6">Buka Shift Kasir</h3>

                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Modal Awal (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.opening_balance}
                                        onChange={(e) => setData('opening_balance', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Masukkan modal awal"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                    {errors.opening_balance && (
                                        <p className="text-red-500 text-xs italic mt-1">{errors.opening_balance}</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Catatan Pembukaan (Opsional)
                                    </label>
                                    <textarea
                                        value={data.opening_notes}
                                        onChange={(e) => setData('opening_notes', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                                        placeholder="Catatan pembukaan shift..."
                                    />
                                    {errors.opening_notes && (
                                        <p className="text-red-500 text-xs italic mt-1">{errors.opening_notes}</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-medium text-blue-800 mb-2">Informasi:</h4>
                                    <ul className="text-blue-700 text-sm space-y-1">
                                        <li>• Pastikan modal awal sesuai dengan uang tunai yang tersedia di kasir</li>
                                        <li>• Shift akan dimulai setelah Anda menekan tombol "Buka Shift"</li>
                                        <li>• Anda hanya bisa membuka satu shift dalam satu waktu</li>
                                        <li>• Pastikan untuk menutup shift di akhir jam kerja</li>
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
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                    >
                                        {processing ? 'Membuka...' : 'Buka Shift'}
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
