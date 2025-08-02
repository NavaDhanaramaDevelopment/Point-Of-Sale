import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TransferDetails({ auth, transfer }) {
    const getStatusBadge = (status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_transit: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const getTotalValue = () => {
        return transfer.items.reduce((sum, item) => sum + item.total_cost, 0);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Transfer ${transfer.transfer_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Transfer #{transfer.transfer_number}
                                    </h2>
                                    <div className="mt-2">
                                        {getStatusBadge(transfer.status)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.visit(route('transfers.index'))}
                                    className="inline-flex items-center px-4 py-2 bg-gray-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Transfers
                                </button>
                            </div>

                            {/* Transfer Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Information</h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Transfer Number</dt>
                                            <dd className="text-sm text-gray-900">{transfer.transfer_number}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="text-sm text-gray-900">{getStatusBadge(transfer.status)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Transfer Date</dt>
                                            <dd className="text-sm text-gray-900">
                                                {new Date(transfer.transfer_date).toLocaleDateString()}
                                            </dd>
                                        </div>
                                        {transfer.expected_arrival_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Expected Arrival</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {new Date(transfer.expected_arrival_date).toLocaleDateString()}
                                                </dd>
                                            </div>
                                        )}
                                        {transfer.received_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Received Date</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {new Date(transfer.received_date).toLocaleDateString()}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Outlet Information</h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">From Outlet</dt>
                                            <dd className="text-sm text-gray-900">
                                                {transfer.from_outlet?.name} ({transfer.from_outlet?.code})
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">To Outlet</dt>
                                            <dd className="text-sm text-gray-900">
                                                {transfer.to_outlet?.name} ({transfer.to_outlet?.code})
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                            <dd className="text-sm text-gray-900">{transfer.creator?.name}</dd>
                                        </div>
                                        {transfer.receiver && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Received By</dt>
                                                <dd className="text-sm text-gray-900">{transfer.receiver?.name}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Notes */}
                            {transfer.notes && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700">{transfer.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Transfer Items */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Qty Requested
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Qty Sent
                                                </th>
                                                {transfer.status === 'delivered' && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Qty Received
                                                    </th>
                                                )}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Unit Cost
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Cost
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transfer.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.product?.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.product?.code}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.quantity_requested}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.quantity_sent}
                                                    </td>
                                                    {transfer.status === 'delivered' && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.quantity_received || 0}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        Rp {parseFloat(item.unit_cost).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        Rp {parseFloat(item.total_cost).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td
                                                    colSpan={transfer.status === 'delivered' ? "5" : "4"}
                                                    className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                                                >
                                                    Total Transfer Value:
                                                </td>
                                                <td className="px-6 py-3 text-sm font-bold text-gray-900">
                                                    Rp {getTotalValue().toLocaleString()}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {transfer.status === 'pending' && (
                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        onClick={() => router.visit(route('transfers.edit', transfer.id))}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Edit Transfer
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to cancel this transfer?')) {
                                                router.patch(route('transfers.cancel', transfer.id));
                                            }
                                        }}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Cancel Transfer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
