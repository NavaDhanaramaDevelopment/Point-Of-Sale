import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SubcategoryEdit({ subcategory, categories }) {
    const [form, setForm] = useState({
        name: subcategory.name || '',
        category_id: subcategory.category_id || ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        router.put(route('subcategory.update', subcategory.id), form, { onError: setErrors });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-blue-800">Edit Subkategori</h2>}>
            <Head title="Edit Subkategori" />
            <div className="py-8 max-w-xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-1">Nama Subkategori</label>
                            <input type="text" name="name" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.name} onChange={handleChange} required />
                            {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Kategori</label>
                            <select name="category_id" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.category_id} onChange={handleChange} required>
                                <option value="">- Pilih Kategori -</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            {errors.category_id && <div className="text-red-600 text-xs mt-1">{errors.category_id}</div>}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">Simpan</button>
                            <Link href={route('subcategory.index')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
