import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Select from 'react-select';

export default function Create({ auth, outlets }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        birth_date: '',
        gender: '',
        discount_percentage: '',
        outlet_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    const outletOptions = outlets.map(o => ({ value: o.id, label: `${o.name} (${o.code})` }));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Customer</h2>}
        >
            <Head title="Tambah Customer" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Nama Lengkap *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            No. Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="customer@example.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                                            Tanggal Lahir
                                        </label>
                                        <input
                                            type="date"
                                            id="birth_date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.birth_date && <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                            Jenis Kelamin
                                        </label>
                                        <select
                                            id="gender"
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Pilih Jenis Kelamin</option>
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Alamat
                                        </label>
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows="3"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Alamat lengkap..."
                                        />
                                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700">
                                            Diskon Khusus (%)
                                        </label>
                                        <input
                                            type="number"
                                            id="discount_percentage"
                                            value={data.discount_percentage}
                                            onChange={(e) => setData('discount_percentage', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="0"
                                        />
                                        {errors.discount_percentage && <p className="mt-1 text-sm text-red-600">{errors.discount_percentage}</p>}
                                        <p className="mt-1 text-xs text-gray-500">Diskon khusus yang akan diterapkan untuk customer ini</p>
                                    </div>

                                    <div>
                                        <label htmlFor="outlet_id" className="block text-sm font-medium text-gray-700">
                                            Outlet
                                        </label>
                                        <Select
                                            id="outlet_id"
                                            options={outletOptions}
                                            value={outletOptions.find(opt => opt.value === data.outlet_id) || null}
                                            onChange={opt => setData('outlet_id', opt ? opt.value : '')}
                                            placeholder="Pilih Outlet"
                                            className="mt-1"
                                        />
                                        {errors.outlet_id && <p className="mt-1 text-sm text-red-600">{errors.outlet_id}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6 space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Customer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
