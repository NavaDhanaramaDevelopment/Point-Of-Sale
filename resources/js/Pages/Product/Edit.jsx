import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function ProductEdit({ product, categories }) {
    const [form, setForm] = useState({
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        unit: product.unit || 'pcs',
        purchase_price: product.purchase_price || '',
        sell_price: product.sell_price || '',
        stock: product.stock || '',
        stock_minimum: product.stock_minimum || '',
        image: null
    });
    const [subcategories, setSubcategories] = useState([]);
    const [preview, setPreview] = useState(product.image ? `/storage/${product.image}` : null);
    const [errors, setErrors] = useState({});
    const fileInput = useRef();

    useEffect(() => {
        const cat = categories.find(c => c.id == form.category_id);
        setSubcategories(cat ? cat.subcategories : []);
    }, [form.category_id, categories]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setForm(f => ({ ...f, image: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(f => ({ ...f, [name]: value }));
            if (name === 'category_id') {
                const cat = categories.find(c => c.id == value);
                setSubcategories(cat ? cat.subcategories : []);
                setForm(f => ({ ...f, subcategory_id: '' }));
            }
        }
    };

    // Barcode scan via camera (html5-qrcode)
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-blue-800">Edit Produk</h2>}>
            <Head title="Edit Produk" />
            <div className="py-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block font-semibold mb-1">Nama Produk</label>
                            <input type="text" name="name" className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.name} onChange={handleChange} required />
                            {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-semibold mb-1">Deskripsi</label>
                            <textarea name="description" className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.description} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Kategori</label>
                            <select name="category_id" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.category_id} onChange={handleChange}>
                                <option value="">- Pilih Kategori -</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Subkategori</label>
                            <select name="subcategory_id" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.subcategory_id} onChange={handleChange}>
                                <option value="">- Pilih Subkategori -</option>
                                {subcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">SKU</label>
                            <input type="text" name="sku" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.sku} onChange={handleChange} required />
                            {errors.sku && <div className="text-red-600 text-xs mt-1">{errors.sku}</div>}
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Barcode</label>
                            <div className="flex gap-2">
                                <input type="text" name="barcode" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.barcode} onChange={handleChange} />
                                <button type="button" onClick={handleScanBarcode} className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600">Scan</button>
                            </div>
                            <div id="barcode-scanner" className="mt-2"></div>
                            {errors.barcode && <div className="text-red-600 text-xs mt-1">{errors.barcode}</div>}
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Satuan</label>
                            <input type="text" name="unit" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.unit} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Harga Beli</label>
                            <input type="number" name="purchase_price" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.purchase_price} onChange={handleChange} required min="0" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Harga Jual</label>
                            <input type="number" name="sell_price" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.sell_price} onChange={handleChange} required min="0" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Stok</label>
                            <input type="number" name="stock" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.stock} onChange={handleChange} required min="0" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Stok Minimum</label>
                            <input type="number" name="stock_minimum" className="w-full border border-blue-200 rounded-lg px-3 py-2" value={form.stock_minimum} onChange={handleChange} required min="0" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-semibold mb-1">Gambar Produk</label>
                            <input type="file" name="image" accept="image/*" className="w-full border border-blue-200 rounded-lg px-3 py-2" ref={fileInput} onChange={handleChange} />
                            {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover mt-2 rounded-lg border" />}
                        </div>
                        <div className="md:col-span-2 flex gap-2 mt-4">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold w-full md:w-auto">Simpan</button>
                            <Link href={route('product.index')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold w-full md:w-auto text-center">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
            {/* Barcode scanner library loader */}
            <script src="https://unpkg.com/html5-qrcode" defer></script>
        </AuthenticatedLayout>
    );
}
