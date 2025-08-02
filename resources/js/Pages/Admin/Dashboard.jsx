import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard({ auth }) {
    // Peran user, misal: 'admin', 'manager', 'kasir'
    const role = auth.user.role;

    let header, dashboardContent;

    if (role === 'admin') {
        header = (
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                </div>
                <h2 className="text-xl font-semibold leading-tight text-blue-800">Admin Dashboard</h2>
            </div>
        );
        dashboardContent = (
            <>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Welcome, {auth.user.name}!</h3>
                    <p className="text-blue-600">You are logged in as an Administrator. You have full access to all system features.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-800 mb-2">User Management</h4>
                        <p className="text-blue-600 text-sm">Manage users, roles, and permissions</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <h4 className="text-lg font-semibold text-green-800 mb-2">Product Management</h4>
                        <p className="text-green-600 text-sm">Add, edit, and manage product inventory</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <h4 className="text-lg font-semibold text-purple-800 mb-2">Reports & Analytics</h4>
                        <p className="text-purple-600 text-sm">View sales reports and analytics</p>
                    </div>
                </div>
                <div className="mt-8">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">Quick Actions</h4>
                    <div className="flex space-x-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">Add New User</button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md">Add Product</button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-md">View Reports</button>
                    </div>
                </div>
            </>
        );
    } else if (role === 'manager') {
        header = (
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                </div>
                <h2 className="text-xl font-semibold leading-tight text-blue-800">Manager Dashboard</h2>
            </div>
        );
        dashboardContent = (
            <>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Welcome, {auth.user.name}!</h3>
                    <p className="text-blue-600">You are logged in as a Manager. You can manage products, view reports, and oversee daily operations.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <h4 className="text-lg font-semibold text-green-800 mb-2">Product Management</h4>
                        <p className="text-green-600 text-sm">Manage inventory, pricing, and product categories</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-800 mb-2">Sales Reports</h4>
                        <p className="text-blue-600 text-sm">Monitor daily sales and performance metrics</p>
                    </div>
                </div>
                <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
                    <div className="flex space-x-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Manage Products</button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">View Reports</button>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition">Check Inventory</button>
                    </div>
                </div>
            </>
        );
    } else if (role === 'kasir') {
        header = (
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">K</span>
                </div>
                <h2 className="text-xl font-semibold leading-tight text-blue-800">Kasir Dashboard</h2>
            </div>
        );
        dashboardContent = (
            <>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Welcome, {auth.user.name}!</h3>
                    <p className="text-blue-600">You are logged in as a Cashier. Start a new transaction or view your sales history.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-800 mb-2">Point of Sale</h4>
                        <p className="text-blue-600 text-sm mb-4">Process customer transactions quickly and efficiently</p>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md">Start New Sale</button>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-800 mb-2">Today's Summary</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-blue-600">Transactions:</span><span className="font-semibold text-blue-800">0</span></div>
                            <div className="flex justify-between"><span className="text-blue-600">Total Sales:</span><span className="font-semibold text-blue-800">Rp 0</span></div>
                            <div className="flex justify-between"><span className="text-blue-600">Items Sold:</span><span className="font-semibold text-blue-800">0</span></div>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
                    <div className="flex space-x-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">New Transaction</button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Search Product</button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">View History</button>
                    </div>
                </div>
            </>
        );
    } else {
        header = (
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">?</span>
                </div>
                <h2 className="text-xl font-semibold leading-tight text-blue-800">Dashboard</h2>
            </div>
        );
        dashboardContent = (
            <>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Welcome, {auth.user.name}!</h3>
                    <p className="text-blue-600">Your role is not recognized. Please contact the administrator.</p>
                </div>
            </>
        );
    }

    return (
        <AuthenticatedLayout header={header}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg border border-blue-100">
                        <div className="p-6 text-gray-900">
                            {dashboardContent}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
