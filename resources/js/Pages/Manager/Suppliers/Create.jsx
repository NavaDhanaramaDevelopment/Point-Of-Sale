import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ outlets }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        contact_person: '',
        status: 'active',
        notes: '',
        outlet_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('manager.suppliers.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create New Supplier
                    </h2>
                    <Link
                        href={route('manager.suppliers.index')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to Suppliers
                    </Link>
                </div>
            }
        >
            <Head title="Create New Supplier" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="outlet_id" value="Outlet" />
                                        <select
                                            id="outlet_id"
                                            name="outlet_id"
                                            value={data.outlet_id}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) => setData('outlet_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Outlet</option>
                                            {outlets.map((outlet) => (
                                                <option key={outlet.id} value={outlet.id}>
                                                    {outlet.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.outlet_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="name" value="Supplier Name" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="company" value="Company Name" />
                                        <TextInput
                                            id="company"
                                            type="text"
                                            name="company"
                                            value={data.company}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('company', e.target.value)}
                                        />
                                        <InputError message={errors.company} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone" />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            value={data.phone}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="address" value="Address" />
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={data.address}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                            onChange={(e) => setData('address', e.target.value)}
                                        />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="contact_person" value="Contact Person" />
                                        <TextInput
                                            id="contact_person"
                                            type="text"
                                            name="contact_person"
                                            value={data.contact_person}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                        />
                                        <InputError message={errors.contact_person} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) => setData('status', e.target.value)}
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
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

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Create Supplier
                                    </PrimaryButton>

                                    <Link
                                        href={route('manager.suppliers.index')}
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
