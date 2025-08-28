import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Print({ purchaseOrder }) {
    useEffect(() => {
        // Auto print when component mounts
        window.print();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const calculateTotal = () => {
        return purchaseOrder.items?.reduce((total, item) => total + item.total_cost, 0) || 0;
    };

    return (
        <>
            <Head title={`Print Purchase Order: ${purchaseOrder.po_number}`} />
            
            <div className="min-h-screen bg-white p-8 print:p-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">PURCHASE ORDER</h1>
                    <p className="text-lg font-semibold">{purchaseOrder.po_number}</p>
                </div>

                {/* Company and Supplier Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* From (Company/Outlet) */}
                    <div>
                        <h2 className="text-lg font-bold mb-2">From:</h2>
                        <div className="text-sm">
                            <p className="font-bold">{purchaseOrder.outlet?.name}</p>
                            <p>{purchaseOrder.outlet?.address}</p>
                            <p>Phone: {purchaseOrder.outlet?.phone}</p>
                        </div>
                    </div>

                    {/* To (Supplier) */}
                    <div>
                        <h2 className="text-lg font-bold mb-2">To:</h2>
                        <div className="text-sm">
                            <p className="font-bold">{purchaseOrder.supplier?.company}</p>
                            <p>Attn: {purchaseOrder.supplier?.contact_person}</p>
                            <p>{purchaseOrder.supplier?.address}</p>
                            <p>Phone: {purchaseOrder.supplier?.phone}</p>
                            <p>Email: {purchaseOrder.supplier?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="mb-6 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><span className="font-semibold">Order Date:</span> {new Date(purchaseOrder.order_date).toLocaleDateString('id-ID')}</p>
                            {purchaseOrder.expected_delivery_date && (
                                <p><span className="font-semibold">Expected Delivery:</span> {new Date(purchaseOrder.expected_delivery_date).toLocaleDateString('id-ID')}</p>
                            )}
                        </div>
                        <div>
                            <p><span className="font-semibold">Status:</span> {purchaseOrder.status.toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left border">No.</th>
                            <th className="px-4 py-2 text-left border">Product</th>
                            <th className="px-4 py-2 text-left border">Barcode</th>
                            <th className="px-4 py-2 text-right border">Quantity</th>
                            <th className="px-4 py-2 text-right border">Unit Price</th>
                            <th className="px-4 py-2 text-right border">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseOrder.items.map((item, index) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{item.product?.name}</td>
                                <td className="px-4 py-2 border">{item.product?.barcode}</td>
                                <td className="px-4 py-2 text-right border">{item.quantity_ordered}</td>
                                <td className="px-4 py-2 text-right border">{formatCurrency(item.unit_cost)}</td>
                                <td className="px-4 py-2 text-right border">{formatCurrency(item.total_cost)}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50">
                            <td colSpan="5" className="px-4 py-2 text-right border font-bold">Total:</td>
                            <td className="px-4 py-2 text-right border font-bold">{formatCurrency(calculateTotal())}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Notes */}
                {purchaseOrder.notes && (
                    <div className="mb-8">
                        <h3 className="font-bold mb-2">Notes:</h3>
                        <p className="text-sm">{purchaseOrder.notes}</p>
                    </div>
                )}

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-8 mt-16">
                    <div className="text-center">
                        <div className="mb-16"></div>
                        <div className="border-t border-black pt-2">
                            <p className="font-semibold">Prepared by</p>
                            <p className="text-sm">{purchaseOrder.user?.name}</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="mb-16"></div>
                        <div className="border-t border-black pt-2">
                            <p className="font-semibold">Approved by</p>
                            <p className="text-sm">_________________</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="mb-16"></div>
                        <div className="border-t border-black pt-2">
                            <p className="font-semibold">Received by</p>
                            <p className="text-sm">_________________</p>
                        </div>
                    </div>
                </div>

                {/* Print Styles */}
                <style>{`
                    @media print {
                        @page {
                            size: A4;
                            margin: 1cm;
                        }
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        .print-only {
                            display: block;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}</style>
            </div>
        </>
    );
}
