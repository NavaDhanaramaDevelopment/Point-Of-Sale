import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ManagerDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-blue-800">
                        Manager Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Manager Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg border border-blue-100">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                    Welcome, {auth.user.name}!
                                </h3>
                                <p className="text-blue-600">
                                    You are logged in as a Manager. You can manage products, view reports, and oversee daily operations.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <h4 className="text-lg font-semibold text-green-800 mb-2">
                                        Product Management
                                    </h4>
                                    <p className="text-green-600 text-sm">
                                        Manage inventory, pricing, and product categories
                                    </p>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <h4 className="text-lg font-semibold text-blue-800 mb-2">
                                        Sales Reports
                                    </h4>
                                    <p className="text-blue-600 text-sm">
                                        Monitor daily sales and performance metrics
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                    Today's Overview
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white border rounded-lg p-4">
                                        <div className="text-2xl font-bold text-gray-800">0</div>
                                        <div className="text-sm text-gray-600">Today's Sales</div>
                                    </div>
                                    <div className="bg-white border rounded-lg p-4">
                                        <div className="text-2xl font-bold text-gray-800">0</div>
                                        <div className="text-sm text-gray-600">Transactions</div>
                                    </div>
                                    <div className="bg-white border rounded-lg p-4">
                                        <div className="text-2xl font-bold text-gray-800">0</div>
                                        <div className="text-sm text-gray-600">Products Sold</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                    Quick Actions
                                </h4>
                                <div className="flex space-x-4">
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                        Manage Products
                                    </button>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                        View Reports
                                    </button>
                                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition">
                                        Check Inventory
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
