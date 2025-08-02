import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EditTransfer({ auth, transfer, outlets, products }) {
    const { data, setData, put, processing, errors } = useForm({
        from_outlet_id: transfer.from_outlet_id,
        to_outlet_id: transfer.to_outlet_id,
        transfer_date: transfer.transfer_date,
        expected_arrival_date: transfer.expected_arrival_date || '',
        notes: transfer.notes || '',
        items: transfer.items || []
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitCost, setUnitCost] = useState('');

    const canEdit = transfer.status === 'pending';

    const addItem = () => {
        if (!selectedProduct || !quantity || !unitCost) {
            alert('Please fill all item fields');
            return;
        }

        const product = products.find(p => p.id === parseInt(selectedProduct));
        if (!product) return;

        // Check if product already exists in items
        const existingIndex = data.items.findIndex(item => item.product_id === parseInt(selectedProduct));

        if (existingIndex >= 0) {
            // Update existing item
            const newItems = [...data.items];
            newItems[existingIndex] = {
                ...newItems[existingIndex],
                quantity_requested: parseInt(quantity),
                unit_cost: parseFloat(unitCost)
            };
            setData('items', newItems);
        } else {
            // Add new item
            setData('items', [...data.items, {
                product_id: parseInt(selectedProduct),
                product_name: product.name,
                product_code: product.code,
                quantity_requested: parseInt(quantity),
                unit_cost: parseFloat(unitCost)
            }]);
        }

        // Reset form
        setSelectedProduct('');
        setQuantity('');
        setUnitCost('');
    };

    const removeItem = (index) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.items.length === 0) {
            alert('Please add at least one item');
            return;
        }

        put(route('transfers.update', transfer.id), {
            onSuccess: () => {
                router.visit(route('transfers.index'));
            }
        });
    };

    const getTotalValue = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity_requested * item.unit_cost), 0);
    };

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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Outlet Transfer" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Transfer #{transfer.transfer_number}</h2>
                                    <div className="mt-2">
                                        {getStatusBadge(transfer.status)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.visit(route('transfers.index'))}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Back to Transfers
                                </button>
                            </div>

                            {!canEdit && (
                                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                                    <p>This transfer cannot be edited because it has been {transfer.status}.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Transfer Header */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">From Outlet</label>
                                        <select
                                            value={data.from_outlet_id}
                                            onChange={(e) => setData('from_outlet_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                            disabled={!canEdit}
                                        >
                                            <option value="">Select outlet</option>
                                            {outlets.map(outlet => (
                                                <option key={outlet.id} value={outlet.id}>
                                                    {outlet.name} ({outlet.code})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.from_outlet_id && <p className="mt-1 text-sm text-red-600">{errors.from_outlet_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">To Outlet</label>
                                        <select
                                            value={data.to_outlet_id}
                                            onChange={(e) => setData('to_outlet_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                            disabled={!canEdit}
                                        >
                                            <option value="">Select outlet</option>
                                            {outlets.filter(outlet => outlet.id != data.from_outlet_id).map(outlet => (
                                                <option key={outlet.id} value={outlet.id}>
                                                    {outlet.name} ({outlet.code})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.to_outlet_id && <p className="mt-1 text-sm text-red-600">{errors.to_outlet_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Transfer Date</label>
                                        <input
                                            type="date"
                                            value={data.transfer_date}
                                            onChange={(e) => setData('transfer_date', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            required
                                            disabled={!canEdit}
                                        />
                                        {errors.transfer_date && <p className="mt-1 text-sm text-red-600">{errors.transfer_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Expected Arrival Date</label>
                                        <input
                                            type="date"
                                            value={data.expected_arrival_date}
                                            onChange={(e) => setData('expected_arrival_date', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            disabled={!canEdit}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        placeholder="Transfer notes..."
                                        disabled={!canEdit}
                                    />
                                </div>

                                {/* Add Items Section - Only show if can edit */}
                                {canEdit && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Items</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Product</label>
                                                <select
                                                    value={selectedProduct}
                                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                >
                                                    <option value="">Select product</option>
                                                    {products.map(product => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name} ({product.code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    placeholder="Qty"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Unit Cost</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={unitCost}
                                                    onChange={(e) => setUnitCost(e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Total</label>
                                                <input
                                                    type="text"
                                                    value={quantity && unitCost ? `Rp ${(parseFloat(quantity) * parseFloat(unitCost)).toLocaleString()}` : 'Rp 0'}
                                                    readOnly
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                                                />
                                            </div>

                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={addItem}
                                                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                                                >
                                                    <PlusIcon className="h-5 w-5 mr-2" />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Items List */}
                                {data.items.length > 0 && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Items</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Product
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Quantity Requested
                                                        </th>
                                                        {transfer.status !== 'pending' && (
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Quantity Sent
                                                            </th>
                                                        )}
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Unit Cost
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                        {canEdit && (
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Action
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {data.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {item.product?.name || item.product_name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {item.product?.code || item.product_code}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {item.quantity_requested}
                                                            </td>
                                                            {transfer.status !== 'pending' && (
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {item.quantity_sent || 0}
                                                                </td>
                                                            )}
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                Rp {parseFloat(item.unit_cost).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                Rp {(item.quantity_requested * item.unit_cost).toLocaleString()}
                                                            </td>
                                                            {canEdit && (
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeItem(index)}
                                                                        className="text-red-600 hover:text-red-900"
                                                                    >
                                                                        <TrashIcon className="h-5 w-5" />
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <td colSpan={canEdit ? "4" : "3"} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                            Total Transfer Value:
                                                        </td>
                                                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                                                            Rp {getTotalValue().toLocaleString()}
                                                        </td>
                                                        {canEdit && <td></td>}
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                {canEdit && (
                                    <div className="flex justify-end space-x-3 pt-6 border-t">
                                        <button
                                            type="button"
                                            onClick={() => router.visit(route('transfers.index'))}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || data.items.length === 0}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                        >
                                            {processing ? 'Updating...' : 'Update Transfer'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
