import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Products = ({ auth, errors, productReport, filters, categories }) => {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Report</h2>}
        >
            <Head title="Product Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Product Report</h3>
                            <ul className="mt-4">
                                {productReport.map((item, index) => (
                                    <li key={index} className="mb-2">
                                        <strong>{item.product_name}:</strong> {item.total_quantity} sold, {item.total_revenue} revenue
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Products;
