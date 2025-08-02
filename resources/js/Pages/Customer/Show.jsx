import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, customer, recentSales, pointHistory, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Customer</h2>}
        >
            <Head title={`Detail Customer - ${customer.name}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold mb-2">{customer.name}</h3>
                                    <div className="mb-2 text-sm text-gray-600">{customer.email || '-'}</div>
                                    <div className="mb-2 text-sm text-gray-600">{customer.phone || '-'}</div>
                                    <div className="mb-2 text-sm text-gray-600">{customer.address || '-'}</div>
                                    <div className="mb-2 text-sm text-gray-600">{customer.gender === 'male' ? 'Laki-laki' : customer.gender === 'female' ? 'Perempuan' : '-'}</div>
                                    <div className="mb-2 text-sm text-gray-600">Tanggal Lahir: {customer.birth_date || '-'}</div>
                                    <div className="mb-2 text-sm text-gray-600">Diskon Khusus: {customer.discount_percentage ? customer.discount_percentage + '%' : '-'}</div>
                                    <div className="mb-2 text-sm text-gray-600">Status: <span className={`px-2 py-1 rounded ${customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{customer.is_active ? 'Aktif' : 'Nonaktif'}</span></div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="text-xs text-gray-500">Total Poin</div>
                                        <div className="text-2xl font-bold text-blue-700">{customer.points}</div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="text-xs text-gray-500">Total Belanja</div>
                                        <div className="text-xl font-bold text-green-700">Rp {Number(customer.total_spent).toLocaleString('id-ID')}</div>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <div className="text-xs text-gray-500">Kunjungan</div>
                                        <div className="text-xl font-bold text-yellow-700">{customer.visit_count}x</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-xs text-gray-500">Terakhir Kunjungan</div>
                                        <div className="text-sm text-gray-700">{customer.last_visit ? new Date(customer.last_visit).toLocaleString('id-ID') : '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="font-semibold text-lg mb-2">Riwayat Transaksi Terbaru</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentSales.length === 0 && (
                                                <tr><td colSpan={4} className="px-4 py-2 text-center text-gray-500">Belum ada transaksi</td></tr>
                                            )}
                                            {recentSales.map((sale) => (
                                                <tr key={sale.id}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{new Date(sale.created_at).toLocaleString('id-ID')}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        {sale.sale_items.map(item => item.product.name).join(', ')}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        {sale.sale_items.reduce((sum, item) => sum + item.quantity, 0)}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                        Rp {Number(sale.total_amount).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-2">Riwayat Poin</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poin</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pointHistory.length === 0 && (
                                                <tr><td colSpan={4} className="px-4 py-2 text-center text-gray-500">Belum ada riwayat poin</td></tr>
                                            )}
                                            {pointHistory.map((point) => (
                                                <tr key={point.id}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{new Date(point.created_at).toLocaleString('id-ID')}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{point.type}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{point.points}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{point.description || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Link href={route('customers.edit', customer.id)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                    Edit Customer
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
