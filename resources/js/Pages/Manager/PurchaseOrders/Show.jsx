import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ purchaseOrder }) {
    const handleStatusChange = (status) => {
        router.patch(route('manager.purchase-orders.update-status', purchaseOrder.id), {
            status: status
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

        return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badges[status] || badges.draft}`;
    };

    const calculateTotal = () => {
        return purchaseOrder.items?.reduce((total, item) => total + item.total_price, 0) || 0;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Purchase Order: {purchaseOrder.po_number}
                    </h2>
                    <div className="flex space-x-2">
                        {purchaseOrder.status === 'draft' && (
                            <Link
                                href={route('manager.purchase-orders.edit', purchaseOrder.id)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit
                            </Link>
                        )}
                        <Link
                            href={route('manager.purchase-orders.index')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Purchase Order: ${purchaseOrder.po_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Header Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Order Information</h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">PO Number</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.po_number}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="text-sm text-gray-900">
                                                <span className={getStatusBadge(purchaseOrder.status)}>
                                                    {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                                            <dd className="text-sm text-gray-900">
                                                {new Date(purchaseOrder.order_date).toLocaleDateString('id-ID')}
                                            </dd>
                                        </div>
                                        {purchaseOrder.expected_delivery_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Expected Delivery</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {new Date(purchaseOrder.expected_delivery_date).toLocaleDateString('id-ID')}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Outlet Information</h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Outlet Name</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.outlet?.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.outlet?.address}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.outlet?.phone}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Supplier Information</h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Supplier Name</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.supplier?.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Company</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.supplier?.company}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.supplier?.contact_person}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.supplier?.phone}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{purchaseOrder.supplier?.email}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {purchaseOrder.notes && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                                    <p className="text-sm text-gray-600">{purchaseOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>

                            {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Barcode
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
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {purchaseOrder.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.product?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.product?.barcode}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(item.unit_price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(item.total_price)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                    Total Amount:
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {formatCurrency(calculateTotal())}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No items in this purchase order.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                {purchaseOrder.status === 'draft' && (
                                    <>
                                        <Link
                                            href={route('manager.purchase-orders.edit', purchaseOrder.id)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Edit Purchase Order
                                        </Link>
                                        <button
                                            onClick={() => handleStatusChange('pending')}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Submit for Approval
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('cancelled')}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {purchaseOrder.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange('approved')}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('cancelled')}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Reject/Cancel
                                        </button>
                                    </>
                                )}

                                {purchaseOrder.status === 'approved' && (
                                    <button
                                        onClick={() => handleStatusChange('ordered')}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Mark as Ordered
                                    </button>
                                )}

                                {purchaseOrder.status === 'ordered' && (
                                    <button
                                        onClick={() => handleStatusChange('received')}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Mark as Received
                                    </button>
                                )}

                                {/* Print/Export actions can be added here */}
                                <button
                                    onClick={() => window.print()}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
