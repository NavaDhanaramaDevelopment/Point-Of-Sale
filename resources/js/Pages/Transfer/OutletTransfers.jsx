import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, TruckIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function OutletTransfers({ auth, transfers, filters }) {
    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const { data, setData, patch, processing } = useForm({
        status: '',
        received_date: '',
        items: []
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_transit':
                return 'bg-blue-100 text-blue-800';
            case 'received':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusUpdate = (transfer, newStatus) => {
        setSelectedTransfer(transfer);
        setData({
            status: newStatus,
            received_date: newStatus === 'received' ? new Date().toISOString().split('T')[0] : '',
            items: transfer.items.map(item => ({
                id: item.id,
                quantity_received: item.quantity_sent
            }))
        });
        setShowStatusModal(true);
    };

    const submitStatusUpdate = (e) => {
        e.preventDefault();
        patch(route('transfers.update-status', selectedTransfer.id), {
            onSuccess: () => {
                setShowStatusModal(false);
                setSelectedTransfer(null);
            }
        });
    };

    const cancelTransfer = (transfer) => {
        if (confirm('Are you sure you want to cancel this transfer?')) {
            router.patch(route('transfers.cancel', transfer.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Outlet Transfers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Outlet Transfers</h2>
                                <Link
                                    href={route('transfers.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    New Transfer
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Transfer #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                From → To
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Transfer Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Value
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transfers.map((transfer) => (
                                            <tr key={transfer.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {transfer.transfer_number}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Created by: {transfer.creator?.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="font-medium">{transfer.from_outlet?.name}</div>
                                                        <div className="text-xs text-gray-500">↓</div>
                                                        <div className="font-medium">{transfer.to_outlet?.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(transfer.transfer_date).toLocaleDateString()}
                                                    </div>
                                                    {transfer.expected_arrival_date && (
                                                        <div className="text-xs text-gray-500">
                                                            Expected: {new Date(transfer.expected_arrival_date).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                                                        {transfer.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {transfer.items?.length || 0} items
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        Rp {(transfer.total_value || 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('transfers.show', transfer.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </Link>

                                                        {transfer.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(transfer, 'in_transit')}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Mark as In Transit"
                                                                >
                                                                    <TruckIcon className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => cancelTransfer(transfer)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Cancel Transfer"
                                                                >
                                                                    <XMarkIcon className="h-5 w-5" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {transfer.status === 'in_transit' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(transfer, 'received')}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Mark as Received"
                                                            >
                                                                <CheckIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedTransfer && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Update Transfer Status
                            </h3>
                            <form onSubmit={submitStatusUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        New Status
                                    </label>
                                    <input
                                        type="text"
                                        value={data.status.replace('_', ' ').toUpperCase()}
                                        readOnly
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                                    />
                                </div>

                                {data.status === 'received' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Received Date
                                            </label>
                                            <input
                                                type="date"
                                                value={data.received_date}
                                                onChange={(e) => setData('received_date', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Received Quantities
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {selectedTransfer.items.map((item, index) => (
                                                    <div key={item.id} className="flex items-center space-x-2">
                                                        <span className="text-sm w-32 truncate">{item.product?.name}</span>
                                                        <span className="text-xs text-gray-500">Sent: {item.quantity_sent}</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={item.quantity_sent}
                                                            value={data.items[index]?.quantity_received || 0}
                                                            onChange={(e) => {
                                                                const newItems = [...data.items];
                                                                newItems[index] = {
                                                                    ...newItems[index],
                                                                    quantity_received: parseInt(e.target.value) || 0
                                                                };
                                                                setData('items', newItems);
                                                            }}
                                                            className="w-20 border-gray-300 rounded text-sm"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusModal(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {processing ? 'Updating...' : 'Update Status'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
