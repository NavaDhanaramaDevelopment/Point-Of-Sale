import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Select from 'react-select';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ outlets, suppliers, products }) {
    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [items, setItems] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        outlet_id: '',
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: '',
        notes: '',
        items: []
    });

    const outletOptions = outlets.map(outlet => ({
        value: outlet.id,
        label: outlet.name
    }));

    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.id,
        label: `${supplier.name} - ${supplier.company}`
    }));

    const productOptions = products.map(product => ({
        value: product.id,
        label: `${product.name} - ${product.barcode}`,
        price: product.purchase_price || 0
    }));

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            product_id: '',
            product_name: '',
            quantity: 1,
            unit_price: 0,
            total_price: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const updateItem = (itemId, field, value) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                const updatedItem = { ...item, [field]: value };

                if (field === 'product_id') {
                    const selectedProduct = products.find(p => p.id === parseInt(value));
                    if (selectedProduct) {
                        updatedItem.product_name = selectedProduct.name;
                        updatedItem.unit_price = selectedProduct.purchase_price || 0;
                    }
                }

                if (field === 'quantity' || field === 'unit_price') {
                    updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price;
                }

                return updatedItem;
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.total_price, 0);
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = {
            ...data,
            outlet_id: selectedOutlet?.value,
            supplier_id: selectedSupplier?.value,
            items: items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price
            }))
        };

        post(route('manager.purchase-orders.store'), {
            data: formData
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Purchase Order
                    </h2>
                    <Link
                        href={route('manager.purchase-orders.index')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to Purchase Orders
                    </Link>
                </div>
            }
        >
            <Head title="Create Purchase Order" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel value="Outlet" />
                                        <Select
                                            value={selectedOutlet}
                                            onChange={(option) => {
                                                setSelectedOutlet(option);
                                                setData('outlet_id', option?.value || '');
                                            }}
                                            options={outletOptions}
                                            placeholder="Select outlet..."
                                            className="mt-1"
                                            isSearchable
                                        />
                                        <InputError message={errors.outlet_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Supplier" />
                                        <Select
                                            value={selectedSupplier}
                                            onChange={(option) => {
                                                setSelectedSupplier(option);
                                                setData('supplier_id', option?.value || '');
                                            }}
                                            options={supplierOptions}
                                            placeholder="Select supplier..."
                                            className="mt-1"
                                            isSearchable
                                        />
                                        <InputError message={errors.supplier_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="order_date" value="Order Date" />
                                        <TextInput
                                            id="order_date"
                                            type="date"
                                            name="order_date"
                                            value={data.order_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('order_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.order_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="expected_delivery_date" value="Expected Delivery Date" />
                                        <TextInput
                                            id="expected_delivery_date"
                                            type="date"
                                            name="expected_delivery_date"
                                            value={data.expected_delivery_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('expected_delivery_date', e.target.value)}
                                        />
                                        <InputError message={errors.expected_delivery_date} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="notes" value="Notes" />
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={data.notes}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                            onChange={(e) => setData('notes', e.target.value)}
                                        />
                                        <InputError message={errors.notes} className="mt-2" />
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="border-t pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Add Item
                                        </button>
                                    </div>

                                    {items.length > 0 && (
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
                                                            Unit Price
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
                                                    {items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-6 py-4">
                                                                <select
                                                                    value={item.product_id}
                                                                    onChange={(e) => updateItem(item.id, 'product_id', e.target.value)}
                                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                    required
                                                                >
                                                                    <option value="">Select Product</option>
                                                                    {products.map(product => (
                                                                        <option key={product.id} value={product.id}>
                                                                            {product.name} - {product.barcode}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                    min="1"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="number"
                                                                    value={item.unit_price}
                                                                    onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                    min="0"
                                                                    step="0.01"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {formatCurrency(item.total_price)}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {items.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No items added yet. Click "Add Item" to start building your purchase order.
                                        </div>
                                    )}

                                    {items.length > 0 && (
                                        <div className="mt-4 flex justify-end">
                                            <div className="text-xl font-bold">
                                                Total: {formatCurrency(calculateTotal())}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing || items.length === 0}>
                                        Create Purchase Order
                                    </PrimaryButton>

                                    <Link
                                        href={route('manager.purchase-orders.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
