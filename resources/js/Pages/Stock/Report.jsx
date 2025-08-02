import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Report({ auth, products }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        type: '',
        start_date: '',
        end_date: ''
    });
    const [report, setReport] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('stock.report.data'), {
            preserveScroll: true,
            onSuccess: (page) => {
                setReport(page.props.movements ? page.props : null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Stock</h2>}
        >
            <Head title="Laporan Stock" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Produk</label>
                                    <select
                                        id="product_id"
                                        value={data.product_id}
                                        onChange={e => setData('product_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">Semua Produk</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipe</label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">Semua Tipe</option>
                                        <option value="in">Stock In</option>
                                        <option value="out">Stock Out</option>
                                        <option value="adjustment">Penyesuaian</option>
                                        <option value="transfer">Transfer</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div className="md:col-span-4 flex items-end justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : 'Tampilkan Laporan'}
                                    </button>
                                </div>
                            </form>

                            {report && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-2">Ringkasan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="text-xs text-gray-500">Total Stock In</div>
                                            <div className="text-2xl font-bold text-green-700">{report.summary.total_in}</div>
                                        </div>
                                        <div className="p-4 bg-red-50 rounded-lg">
                                            <div className="text-xs text-gray-500">Total Stock Out</div>
                                            <div className="text-2xl font-bold text-red-700">{report.summary.total_out}</div>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="text-xs text-gray-500">Penyesuaian</div>
                                            <div className="text-2xl font-bold text-blue-700">{report.summary.total_adjustments}</div>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <div className="text-xs text-gray-500">Total Transfer</div>
                                            <div className="text-xl font-bold text-purple-700">{report.summary.total_transfers}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {report && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Detail Pergerakan Stock</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Sebelum</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Setelah</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {report.movements.length === 0 && (
                                                    <tr><td colSpan={8} className="px-4 py-2 text-center text-gray-500">Tidak ada data</td></tr>
                                                )}
                                                {report.movements.map((movement) => (
                                                    <tr key={movement.id}>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{new Date(movement.created_at).toLocaleString('id-ID')}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{movement.product.name}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${movement.type === 'in' ? 'bg-green-100 text-green-800' : movement.type === 'out' ? 'bg-red-100 text-red-800' : movement.type === 'adjustment' ? 'bg-blue-100 text-blue-800' : movement.type === 'transfer' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {movement.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{movement.quantity}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{movement.quantity_before}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{movement.quantity_after}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{movement.user?.name || '-'}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{movement.notes || '-'}</td>
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
