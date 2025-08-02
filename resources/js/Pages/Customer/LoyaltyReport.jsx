import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LoyaltyReport({ auth, topCustomers, monthlyStats, pointsStats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Loyalti Customer</h2>}
        >
            <Head title="Laporan Loyalti Customer" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Top 20 Customer Berdasarkan Poin</h3>
                            <div className="overflow-x-auto mb-8">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poin</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Belanja</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kunjungan</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {topCustomers.length === 0 && (
                                            <tr><td colSpan={5} className="px-4 py-2 text-center text-gray-500">Belum ada data</td></tr>
                                        )}
                                        {topCustomers.map((customer) => (
                                            <tr key={customer.id}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700 font-bold">{customer.points}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Rp {Number(customer.total_spent).toLocaleString('id-ID')}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{customer.visit_count}x</td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{customer.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-lg font-semibold mb-4">Statistik Bulanan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Customer Baru</div>
                                    <div className="text-2xl font-bold text-blue-700">{monthlyStats?.new_customers || 0}</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Total Revenue</div>
                                    <div className="text-xl font-bold text-green-700">Rp {Number(monthlyStats?.total_revenue || 0).toLocaleString('id-ID')}</div>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Rata-rata Belanja</div>
                                    <div className="text-xl font-bold text-yellow-700">Rp {Number(monthlyStats?.avg_spent_per_customer || 0).toLocaleString('id-ID')}</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Total Poin Diberikan</div>
                                    <div className="text-xl font-bold text-purple-700">{monthlyStats?.total_points_issued || 0}</div>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mb-4">Statistik Poin</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Total Poin di Sistem</div>
                                    <div className="text-2xl font-bold text-blue-700">{pointsStats?.total_points_in_system || 0}</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Total Poin Earned</div>
                                    <div className="text-xl font-bold text-green-700">{pointsStats?.total_points_earned || 0}</div>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Total Poin Redeemed</div>
                                    <div className="text-xl font-bold text-yellow-700">{pointsStats?.total_points_redeemed || 0}</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Customer Aktif</div>
                                    <div className="text-xl font-bold text-purple-700">{pointsStats?.active_customers || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
