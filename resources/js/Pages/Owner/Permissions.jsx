import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Permissions({ auth, permissions, rolePermissions }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        module: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingPermission) {
            put(route('owner.permissions.update', editingPermission.id), {
                onSuccess: () => {
                    reset();
                    setEditingPermission(null);
                    setShowCreateModal(false);
                },
            });
        } else {
            post(route('owner.permissions.store'), {
                onSuccess: () => {
                    reset();
                    setShowCreateModal(false);
                },
            });
        }
    };

    const handleEdit = (permission) => {
        setData({
            name: permission.name,
            module: permission.module,
            description: permission.description || '',
        });
        setEditingPermission(permission);
        setShowCreateModal(true);
    };

    const handleDelete = (permission) => {
        if (confirm('Are you sure you want to delete this permission? This will remove it from all roles.')) {
            router.delete(route('owner.permissions.destroy', permission.id));
        }
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setEditingPermission(null);
        reset();
    };

    // Get unique modules
    const modules = [...new Set(Object.values(permissions).flat().map(p => p.module))];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Permissions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Manage Permissions</h2>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Add Permission
                                </button>
                            </div>

                            <div className="space-y-6">
                                {Object.entries(permissions).map(([module, modulePermissions]) => (
                                    <div key={module} className="border rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                                            {module} Module
                                        </h3>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Permission Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Description
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Used by Roles
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {modulePermissions.map((permission) => {
                                                        const usedByRoles = Object.entries(rolePermissions)
                                                            .filter(([role, perms]) =>
                                                                perms.some(rp => rp.permission.id === permission.id)
                                                            )
                                                            .map(([role]) => role);

                                                        return (
                                                            <tr key={permission.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {permission.name}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900">
                                                                        {permission.description || '-'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {usedByRoles.map((role) => (
                                                                            <span
                                                                                key={role}
                                                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                                    role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                                                    role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                                                    'bg-green-100 text-green-800'
                                                                                }`}
                                                                            >
                                                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                                                            </span>
                                                                        ))}
                                                                        {usedByRoles.length === 0 && (
                                                                            <span className="text-xs text-gray-400">Not used</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleEdit(permission)}
                                                                            className="text-yellow-600 hover:text-yellow-900"
                                                                        >
                                                                            <PencilIcon className="h-5 w-5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(permission)}
                                                                            className="text-red-600 hover:text-red-900"
                                                                        >
                                                                            <TrashIcon className="h-5 w-5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingPermission ? 'Edit Permission' : 'Add New Permission'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-left">
                                        Permission Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., manage_users, view_reports"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-left">
                                        Module
                                    </label>
                                    <select
                                        value={data.module}
                                        onChange={(e) => setData('module', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Select Module</option>
                                        {modules.map((module) => (
                                            <option key={module} value={module}>
                                                {module.charAt(0).toUpperCase() + module.slice(1)}
                                            </option>
                                        ))}
                                        <option value="new">+ Add New Module</option>
                                    </select>
                                    {data.module === 'new' && (
                                        <input
                                            type="text"
                                            placeholder="Enter new module name"
                                            onChange={(e) => setData('module', e.target.value)}
                                            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    )}
                                    {errors.module && <p className="mt-1 text-sm text-red-600">{errors.module}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-left">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Describe what this permission allows..."
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {processing ? 'Saving...' : (editingPermission ? 'Update' : 'Create')}
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
