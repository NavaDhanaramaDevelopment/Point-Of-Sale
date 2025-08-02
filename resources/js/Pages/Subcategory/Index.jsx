import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function SubcategoryIndex({ subcategories }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-blue-800">Subkategori</h2>}>
            <Head title="Subkategori" />
            <div className="py-8 max-w-3xl mx-auto">
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Daftar Subkategori</h3>
                    <Link href={route('subcategory.create')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Tambah Subkategori</Link>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="p-2 text-left">Nama</th>
                                <th className="p-2 text-left">Kategori</th>
                                <th className="p-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcategories.map(sub => (
                                <tr key={sub.id}>
                                    <td className="p-2">{sub.name}</td>
                                    <td className="p-2">{sub.category?.name}</td>
                                    <td className="p-2">
                                        <Link href={route('subcategory.edit', sub.id)} className="text-blue-600 mr-2">Edit</Link>
                                        <button onClick={() => { if(confirm('Hapus subkategori?')) router.delete(route('subcategory.destroy', sub.id)); }} className="text-red-600">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
