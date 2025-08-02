import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CreateTransfer({ auth, outlets, products }) {
    const { data, setData, post, processing, errors } = useForm({
        from_outlet_id: auth.user.outlet_id || '',
        to_outlet_id: '',
        transfer_date: new Date().toISOString().split('T')[0],
        expected_arrival_date: '',
        notes: '',
        items: []
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitCost, setUnitCost] = useState('');

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

        post(route('transfers.store'), {
            onSuccess: () => {
                router.visit(route('transfers.index'));
            }
        });
    };

    const getTotalValue = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity_requested * item.unit_cost), 0);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Outlet Transfer" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Create Outlet Transfer</h2>
                                <button
                                    onClick={() => router.visit(route('transfers.index'))}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Back to Transfers
                                </button>
                            </div>

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
                                    />
                                </div>

                                {/* Add Items Section */}
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
                                                            Quantity
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Unit Cost
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {data.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {item.product_name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {item.product_code}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {item.quantity_requested}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                Rp {parseFloat(item.unit_cost).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                Rp {(item.quantity_requested * item.unit_cost).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(index)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                            Total Transfer Value:
                                                        </td>
                                                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                                                            Rp {getTotalValue().toLocaleString()}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
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
                                        {processing ? 'Creating...' : 'Create Transfer'}
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
