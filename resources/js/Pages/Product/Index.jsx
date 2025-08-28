import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category_id || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('product.index'), { search, category_id: category }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-blue-800">Manajemen Produk</h2>}
        >
            <Head title="Produk" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                className="border rounded-lg px-3 py-2 text-sm"
                                placeholder="Cari nama/SKU/barcode..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <select
                                className="border rounded-lg px-3 py-2 text-sm"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Cari</button>
                        </form>
                        <Link href={route('product.create')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Tambah Produk</Link>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="p-2 text-left">Gambar</th>
                                    <th className="p-2 text-left">Nama</th>
                                    <th className="p-2 text-left">SKU</th>
                                    <th className="p-2 text-left">Barcode</th>
                                    <th className="p-2 text-left">Kategori</th>
                                    <th className="p-2 text-left">Satuan</th>
                                    <th className="p-2 text-right">Harga Jual</th>
                                    <th className="p-2 text-right">Stok</th>
                                    <th className="p-2 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map(product => (
                                    <tr key={product.id} className={product.stock <= product.stock_minimum ? 'bg-red-50' : ''}>
                                        <td className="p-2">
                                            {product.image ? (
                                                <img src={`/storage/${product.image}`} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">-</div>
                                            )}
                                        </td>
                                        <td className="p-2 font-semibold text-blue-900">{product.name}</td>
                                        <td className="p-2">{product.sku}</td>
                                        <td className="p-2">{product.barcode}</td>
                                        <td className="p-2">{product.category?.name || '-'}</td>
                                        <td className="p-2">{product.unit}</td>
                                        <td className="p-2 text-right">{Number(product.selling_price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</td>
                                        <td className="p-2 text-right">
                                            <span className={product.stock <= product.stock_minimum ? 'text-red-600 font-bold' : ''}>{product.stock}</span>
                                        </td>
                                        <td className="p-2 text-center">
                                            <Link href={route('product.edit', product.id)} className="text-blue-600 hover:underline mr-2">Edit</Link>
                                            <button onClick={() => {
                                                if (confirm('Hapus produk ini?')) router.delete(route('product.destroy', product.id));
                                            }} className="text-red-600 hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            {/* Pagination */}
                            {products.links && (
                                <div className="flex gap-2 flex-wrap">
                                    {products.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                            onClick={() => link.url && router.visit(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
