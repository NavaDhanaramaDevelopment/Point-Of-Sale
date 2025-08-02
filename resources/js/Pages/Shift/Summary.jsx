import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Summary = ({ auth, errors, summaryData }) => {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Shift Summary</h2>}
        >
            <Head title="Shift Summary" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Summary Details</h3>
                            <ul className="mt-4">
                                {Array.isArray(summaryData) && summaryData.length > 0 ? (
                                    summaryData.map((item, index) => (
                                        <li key={index} className="mb-2">
                                            <strong>{item.label}:</strong> {item.value}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No summary data available.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Summary;
