import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function CategoryIndex({ categories }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-blue-800">Kategori</h2>}>
            <Head title="Kategori" />
            <div className="py-8 max-w-3xl mx-auto">
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Daftar Kategori</h3>
                    <Link href={route('category.create')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Tambah Kategori</Link>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="p-2 text-left">Outlet</th>
                                <th className="p-2 text-left">Nama</th>
                                <th className="p-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                console.log(cat.outlet),
                                <tr key={cat.id}>
                                    <td className="p-2">{cat.outlet?.name}</td>
                                    <td className="p-2">{cat.name}</td>
                                    <td className="p-2">
                                        <Link href={route('category.edit', cat.id)} className="text-blue-600 mr-2">Edit</Link>
                                        <button onClick={() => { if(confirm('Hapus kategori?')) router.delete(route('category.destroy', cat.id)); }} className="text-red-600">Hapus</button>
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
