import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function SupplierDebts({ auth, debts, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_id: '',
        outlet_id: auth.user.outlet_id || '',
        purchase_order_id: '',
        invoice_number: '',
        total_amount: '',
        due_date: '',
        notes: '',
        // Payment fields
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        reference_number: '',
        payment_notes: '',
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'partial':
                return 'bg-blue-100 text-blue-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCreateDebt = (e) => {
        e.preventDefault();
        post(route('supplier-debts.store'), {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
            }
        });
    };

    const handlePayment = (debt) => {
        setSelectedDebt(debt);
        setData({
            ...data,
            amount: '',
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: 'cash',
            reference_number: '',
            payment_notes: '',
        });
        setShowPaymentModal(true);
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('supplier-debts.payment', selectedDebt.id), {
            data: {
                amount: data.amount,
                payment_date: data.payment_date,
                payment_method: data.payment_method,
                reference_number: data.reference_number,
                notes: data.payment_notes,
            },
            onSuccess: () => {
                setShowPaymentModal(false);
                setSelectedDebt(null);
            }
        });
    };

    const deleteDebt = (debt) => {
        if (confirm('Are you sure you want to delete this debt?')) {
            router.delete(route('supplier-debts.destroy', debt.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Supplier Debts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Supplier Debts (Hutang)</h2>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Add Debt
                                </button>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium text-yellow-800">Pending</div>
                                    <div className="text-2xl font-bold text-yellow-900">
                                        {debts.filter(d => d.status === 'pending').length}
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium text-blue-800">Partial</div>
                                    <div className="text-2xl font-bold text-blue-900">
                                        {debts.filter(d => d.status === 'partial').length}
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium text-green-800">Paid</div>
                                    <div className="text-2xl font-bold text-green-900">
                                        {debts.filter(d => d.status === 'paid').length}
                                    </div>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium text-red-800">Overdue</div>
                                    <div className="text-2xl font-bold text-red-900">
                                        {debts.filter(d => d.status === 'overdue').length}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium text-gray-800">Total Outstanding</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        Rp {debts.filter(d => d.status !== 'paid')
                                            .reduce((sum, d) => sum + parseFloat(d.remaining_amount), 0)
                                            .toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Supplier & Invoice
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Due Date
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
                                        {debts.map((debt) => (
                                            <tr key={debt.id} className={debt.status === 'overdue' ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {debt.supplier?.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {debt.invoice_number}
                                                        </div>
                                                        {debt.purchase_order && (
                                                            <div className="text-xs text-gray-400">
                                                                PO: {debt.purchase_order.order_number}
                                                            </div>
                                                        )}
                                                        {debt.outlet && (
                                                            <div className="text-xs text-gray-400">
                                                                {debt.outlet.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <div>Total: Rp {parseFloat(debt.total_amount).toLocaleString()}</div>
                                                        <div className="text-green-600">Paid: Rp {parseFloat(debt.paid_amount).toLocaleString()}</div>
                                                        <div className="text-red-600 font-medium">
                                                            Outstanding: Rp {parseFloat(debt.remaining_amount).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(debt.due_date).toLocaleDateString()}
                                                    </div>
                                                    {debt.status === 'overdue' && (
                                                        <div className="flex items-center text-red-600 text-xs">
                                                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                                            Overdue
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(debt.status)}`}>
                                                        {debt.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {debt.status !== 'paid' && (
                                                            <button
                                                                onClick={() => handlePayment(debt)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Record Payment"
                                                            >
                                                                <CurrencyDollarIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                        {debt.paid_amount === 0 && (
                                                            <button
                                                                onClick={() => deleteDebt(debt)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Delete"
                                                            >
                                                                Delete
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

            {/* Create Debt Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Supplier Debt</h3>
                            <form onSubmit={handleCreateDebt} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                                    <input
                                        type="text"
                                        value={data.invoice_number}
                                        onChange={(e) => setData('invoice_number', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.invoice_number && <p className="mt-1 text-sm text-red-600">{errors.invoice_number}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.total_amount}
                                        onChange={(e) => setData('total_amount', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.total_amount && <p className="mt-1 text-sm text-red-600">{errors.total_amount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Purchase Order (Optional)</label>
                                    <input
                                        type="text"
                                        value={data.purchase_order_id}
                                        onChange={(e) => setData('purchase_order_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        placeholder="Leave empty if not from PO"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {processing ? 'Creating...' : 'Create Debt'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedDebt && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Record Payment</h3>
                            <div className="mb-4 p-3 bg-gray-50 rounded">
                                <div className="text-sm">
                                    <div><strong>Supplier:</strong> {selectedDebt.supplier?.name}</div>
                                    <div><strong>Invoice:</strong> {selectedDebt.invoice_number}</div>
                                    <div><strong>Outstanding:</strong> Rp {parseFloat(selectedDebt.remaining_amount).toLocaleString()}</div>
                                </div>
                            </div>
                            <form onSubmit={submitPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        max={selectedDebt.remaining_amount}
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                                    <input
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="check">Check</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Reference Number</label>
                                    <input
                                        type="text"
                                        value={data.reference_number}
                                        onChange={(e) => setData('reference_number', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        placeholder="Transaction ID, Check number, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea
                                        value={data.payment_notes}
                                        onChange={(e) => setData('payment_notes', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {processing ? 'Recording...' : 'Record Payment'}
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
