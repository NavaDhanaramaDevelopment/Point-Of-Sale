import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Roles({ auth, roles, rolePermissions }) {
    const [selectedRole, setSelectedRole] = useState('admin');

    const { data, setData, put, processing } = useForm({
        permissions: rolePermissions[selectedRole]?.map(rp => rp.permission.id) || []
    });

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setData('permissions', rolePermissions[role]?.map(rp => rp.permission.id) || []);
    };

    const handlePermissionChange = (permissionId, checked) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('owner.roles.update', selectedRole), {
            onSuccess: () => {
                // Refresh the page or show success message
            },
        });
    };

    // Group permissions by module
    const permissionsByModule = {};
    Object.values(rolePermissions).flat().forEach(rp => {
        const module = rp.permission.module;
        if (!permissionsByModule[module]) {
            permissionsByModule[module] = [];
        }
        if (!permissionsByModule[module].find(p => p.id === rp.permission.id)) {
            permissionsByModule[module].push(rp.permission);
        }
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Roles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Roles & Permissions</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Role Selection */}
                                <div className="lg:col-span-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select Role</h3>
                                    <div className="space-y-2">
                                        {roles.filter(role => role !== 'owner').map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => handleRoleChange(role)}
                                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                                                    selectedRole === role
                                                        ? 'bg-blue-100 text-blue-900 border-blue-200'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Permissions */}
                                <div className="lg:col-span-9">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Permissions for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                                        </h3>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-6">
                                            {Object.entries(permissionsByModule).map(([module, permissions]) => (
                                                <div key={module} className="border rounded-lg p-4">
                                                    <h4 className="text-md font-semibold text-gray-800 mb-3 capitalize">
                                                        {module} Module
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {permissions.map((permission) => (
                                                            <label
                                                                key={permission.id}
                                                                className="flex items-center space-x-3 cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.permissions.includes(permission.id)}
                                                                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                                />
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                    </div>
                                                                    {permission.description && (
                                                                        <div className="text-xs text-gray-500">
                                                                            {permission.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
