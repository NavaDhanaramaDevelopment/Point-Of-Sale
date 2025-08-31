import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Report({ auth, products, movements = [], summary = null, filters = {} }) {
    const [data, setData] = useState({
        product_id: filters.product_id || '',
        type: filters.type || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
    });

    useEffect(() => {
        setData({
            product_id: filters.product_id || '',
            type: filters.type || '',
            start_date: filters.start_date || '',
            end_date: filters.end_date || ''
        });
    }, [filters]);

    const handleInputChange = (key, value) => {
        setData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        router.get(route('stock.report'), data, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <h2 className="font-bold text-2xl text-gray-800">Laporan Stock</h2>
                </div>
            }
        >
            <Head title="Laporan Stock" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-orange-100">
                        <div className="p-8 text-gray-900">
                            {/* Filter Section */}
                            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                                <h3 className="text-lg font-bold text-orange-700 mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                                    Filter Laporan
                                </h3>
                                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="product_id" className="block text-sm font-semibold text-orange-700 mb-2">Produk</label>
                                        <select
                                            id="product_id"
                                            value={data.product_id}
                                            onChange={e => handleInputChange('product_id', e.target.value)}
                                            className="mt-1 block w-full border-orange-200 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                                        >
                                        <option value="">Semua Produk</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-semibold text-orange-700 mb-2">Tipe</label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={e => handleInputChange('type', e.target.value)}
                                        className="mt-1 block w-full border-orange-200 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                                    >
                                        <option value="">Semua Tipe</option>
                                        <option value="in">Stock In</option>
                                        <option value="out">Stock Out</option>
                                        <option value="adjustment">Penyesuaian</option>
                                        <option value="transfer">Transfer</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-semibold text-orange-700 mb-2">Dari Tanggal</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={data.start_date}
                                        onChange={e => handleInputChange('start_date', e.target.value)}
                                        className="mt-1 block w-full border-orange-200 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-semibold text-orange-700 mb-2">Sampai Tanggal</label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={data.end_date}
                                        onChange={e => handleInputChange('end_date', e.target.value)}
                                        className="mt-1 block w-full border-orange-200 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                                    />
                                </div>
                                <div className="md:col-span-4 flex items-end justify-end">
                                    <button
                                        type="submit"
                                        disabled={false}
                                        className="tokaku-button-primary font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                        <span>Tampilkan Laporan</span>
                                    </button>
                                </div>
                            </form>
                            </div>


                            {summary && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mr-3"></div>
                                        Ringkasan Laporan
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="tokaku-card p-6 rounded-xl transform hover:scale-105 transition-all duration-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm text-green-600 font-semibold mb-1">Total Stock In</div>
                                                    <div className="text-3xl font-bold text-green-700">{summary.total_in}</div>
                                                </div>
                                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tokaku-card p-6 rounded-xl transform hover:scale-105 transition-all duration-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm text-red-600 font-semibold mb-1">Total Stock Out</div>
                                                    <div className="text-3xl font-bold text-red-700">{summary.total_out}</div>
                                                </div>
                                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tokaku-card p-6 rounded-xl transform hover:scale-105 transition-all duration-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm text-blue-600 font-semibold mb-1">Total Penyesuaian</div>
                                                    <div className="text-3xl font-bold text-blue-700">{summary.total_adjustments}</div>
                                                </div>
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tokaku-card p-6 rounded-xl transform hover:scale-105 transition-all duration-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm text-purple-600 font-semibold mb-1">Total Transfer</div>
                                                    <div className="text-3xl font-bold text-purple-700">{summary.total_transfers}</div>
                                                </div>
                                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {movements && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mr-3"></div>
                                        Detail Pergerakan Stock
                                    </h3>
                                    <div className="overflow-x-auto bg-white rounded-xl border border-orange-100 shadow-lg">
                                        <table className="min-w-full table-auto">
                                            <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Tanggal</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Produk</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Tipe</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Qty</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Stock Sebelum</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Stock Setelah</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Catatan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-orange-100">
                                                {movements.length === 0 && (
                                                    <tr>
                                                        <td colSpan={8} className="px-6 py-8 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                                                    </svg>
                                                                </div>
                                                                <p className="text-gray-500 font-medium">Tidak ada data pergerakan stock</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                {movements.map((movement) => (
                                                    <tr key={movement.id} className="hover:bg-orange-25 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(movement.created_at).toLocaleString('id-ID')}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{movement.product.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                                                                movement.type === 'in'
                                                                    ? 'bg-green-100 text-green-800 border-green-200'
                                                                    : movement.type === 'out'
                                                                    ? 'bg-red-100 text-red-800 border-red-200'
                                                                    : movement.type === 'adjustment'
                                                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                                    : movement.type === 'transfer'
                                                                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                                                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                                            }`}>
                                                                {movement.type.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">{movement.quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{movement.quantity_before}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{movement.quantity_after}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{movement.user?.name || '-'}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={movement.notes}>{movement.notes || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
