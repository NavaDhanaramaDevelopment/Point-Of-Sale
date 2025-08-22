import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Adjustment({ products }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        new_stock: '',
        notes: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductChange = (e) => {
        const productId = e.target.value;
        setData('product_id', productId);
        const product = products.find(p => p.id === parseInt(productId));
        setSelectedProduct(product || null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('stock.adjustment.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Penyesuaian Stok
                    </h2>
                    <Link
                        href={route('stock.index')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali ke Riwayat Stok
                    </Link>
                </div>
            }
        >
            <Head title="Penyesuaian Stok" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="product_id" value="Produk" />
                                    <select
                                        id="product_id"
                                        name="product_id"
                                        value={data.product_id}
                                        onChange={handleProductChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Pilih Produk</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.product_id} className="mt-2" />
                                </div>

                                {selectedProduct && (
                                    <div className="bg-gray-50 p-4 rounded mb-4">
                                        <div className="text-sm text-gray-700">Stok Saat Ini: <span className="font-bold">{selectedProduct.stock_quantity}</span></div>
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="new_stock" value="Stok Baru" />
                                    <TextInput
                                        id="new_stock"
                                        type="number"
                                        name="new_stock"
                                        value={data.new_stock}
                                        onChange={e => setData('new_stock', e.target.value)}
                                        className="mt-1 block w-full"
                                        min="0"
                                        required
                                    />
                                    <InputError message={errors.new_stock} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="notes" value="Catatan" />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                        required
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Simpan Penyesuaian
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        className="text-gray-600 hover:text-gray-900"
                                        onClick={() => reset()}
                                    >
                                        Reset
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
