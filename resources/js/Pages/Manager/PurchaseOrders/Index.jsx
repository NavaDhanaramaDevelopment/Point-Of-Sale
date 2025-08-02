import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ purchaseOrders, outlets }) {
    const [search, setSearch] = useState('');

    const handleStatusChange = (purchaseOrderId, status) => {
        router.patch(route('manager.purchase-orders.update-status', purchaseOrderId), {
            status: status
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('manager.purchase-orders.index'), { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'bg-gray-100 text-gray-800',
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            ordered: 'bg-indigo-100 text-indigo-800',
            received: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || badges.draft}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Purchase Orders Management
                    </h2>
                    <Link
                        href={route('manager.purchase-orders.create')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Purchase Order
                    </Link>
                </div>
            }
        >
            <Head title="Purchase Orders Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Search and Filter */}
                            <div className="mb-6">
                                <form onSubmit={handleSearch} className="flex gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Search by PO number, supplier name..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Purchase Orders Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                PO Number
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Outlet
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Supplier
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {purchaseOrders.data.map((po) => (
                                            <tr key={po.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {po.po_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {po.outlet?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {po.supplier?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(po.order_date).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatCurrency(po.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getStatusBadge(po.status)}>
                                                        {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link
                                                        href={route('manager.purchase-orders.show', po.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View
                                                    </Link>

                                                    {po.status === 'draft' && (
                                                        <>
                                                            <Link
                                                                href={route('manager.purchase-orders.edit', po.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleStatusChange(po.id, 'pending')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Submit
                                                            </button>
                                                        </>
                                                    )}

                                                    {po.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(po.id, 'approved')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(po.id, 'cancelled')}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}

                                                    {po.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleStatusChange(po.id, 'ordered')}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Mark Ordered
                                                        </button>
                                                    )}

                                                    {po.status === 'ordered' && (
                                                        <button
                                                            onClick={() => handleStatusChange(po.id, 'received')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Mark Received
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {purchaseOrders.data.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">
                                        <p className="text-lg font-medium">No purchase orders found</p>
                                        <p className="mt-1">Get started by creating a new purchase order.</p>
                                    </div>
                                    <div className="mt-6">
                                        <Link
                                            href={route('manager.purchase-orders.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Create Purchase Order
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {purchaseOrders.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {purchaseOrders.from} to {purchaseOrders.to} of {purchaseOrders.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {purchaseOrders.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
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
