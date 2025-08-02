import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function StockIn({ auth, products }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        quantity: '',
        notes: ''
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductChange = (e) => {
        const productId = e.target.value;
        setData('product_id', productId);

        const product = products.find(p => p.id == productId);
        setSelectedProduct(product);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('stock.in.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Stock In</h2>}
        >
            <Head title="Stock In" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">
                                        Produk *
                                    </label>
                                    <select
                                        id="product_id"
                                        value={data.product_id}
                                        onChange={handleProductChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Pilih Produk</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} (Stock: {product.stock})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product_id && <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>}
                                </div>

                                {selectedProduct && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-900">Informasi Produk</h4>
                                        <p className="text-sm text-gray-600">Stock Saat Ini: {selectedProduct.stock}</p>
                                        <p className="text-sm text-gray-600">Harga Beli: Rp {Number(selectedProduct.purchase_price).toLocaleString('id-ID')}</p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        min="1"
                                        required
                                    />
                                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Catatan (Opsional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="3"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Catatan tambahan..."
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {data.quantity && selectedProduct && (
                                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-medium text-blue-900">Summary</h4>
                                        <p className="text-sm text-blue-700">Stock Setelah: {selectedProduct.stock + parseInt(data.quantity || 0)}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-end space-x-4">
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
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Stock In'}
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
