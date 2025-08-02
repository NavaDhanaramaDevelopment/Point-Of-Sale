import React, { useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PosIndex() {
    const [barcode, setBarcode] = useState('');
    const [cart, setCart] = useState([]);
    const [inputQty, setInputQty] = useState(1);
    const [product, setProduct] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerContact, setCustomerContact] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [holdNote, setHoldNote] = useState('');
    const [message, setMessage] = useState('');

    const handleScan = async () => {
        if (!barcode) return;
        const res = await axios.post(route('pos.scanBarcode'), { barcode });
        if (res.data) {
            setProduct(res.data);
        } else {
            setMessage('Produk tidak ditemukan');
        }
    };

    const addToCart = () => {
        if (!product) return;
        // Pastikan price bertipe number
        const price = Number(product.sell_price) || 0;
        const qty = Number(inputQty) || 1;
        const exists = cart.find(item => item.product_id === product.id);
        if (exists) {
            setCart(cart.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + qty, subtotal: (item.quantity + qty) * price } : item));
        } else {
            setCart([...cart, {
                product_id: product.id,
                product_name: product.name,
                barcode: product.barcode,
                price: price,
                quantity: qty,
                subtotal: price * qty,
            }]);
        }
        setProduct(null);
        setBarcode('');
        setInputQty(1);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.product_id !== id));
    };

    const total = cart.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
    const grandTotal = total - (Number(discount) || 0) + (Number(tax) || 0);

    const handleSubmit = async () => {
        if (cart.length === 0) return;
        await axios.post(route('pos.store'), {
            items: cart,
            total,
            discount,
            tax,
            grand_total: grandTotal,
            payment_method: paymentType,
            payment_details: paymentDetails,
            customer_name: customerName,
            customer_contact: customerContact,
        }).then(() => {
            setCart([]);
            setMessage('Transaksi berhasil!');
        }).catch(e => {
            setMessage('Gagal menyimpan transaksi');
        });
    };

    const handleHold = async () => {
        if (cart.length === 0) return;
        await axios.post(route('pos.hold'), {
            cart_data: JSON.stringify(cart),
            note: holdNote,
        }).then(() => {
            setCart([]);
            setMessage('Cart di-hold!');
        }).catch(e => {
            setMessage('Gagal hold cart');
        });
    };

    return (
        <AuthenticatedLayout>
            <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
                <div className="w-full max-w-8xl bg-white rounded-xl shadow-lg p-8 border border-blue-100 mx-20">
                    <h1 className="text-2xl font-bold mb-6 text-center">Point of Sale (POS)</h1>
                    {message && <div className="mb-4 text-green-600 text-center font-semibold">{message}</div>}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Cart & Scan */}
                        <div className="flex-1">
                            <div className="flex gap-2 mb-4">
                                <input type="text" className="border border-blue-200 rounded-lg px-3 py-2 w-full" placeholder="Scan/masukkan barcode" value={barcode} onChange={e => setBarcode(e.target.value)} />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={handleScan}>Scan</button>
                            </div>
                            {product && (
                                <div className="mb-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
                                    <div className="font-semibold">{product.name}</div>
                                    <div>Harga: <b>Rp{product.price}</b></div>
                                    <div>Stok: {product.stock}</div>
                                    <div className="flex gap-2 mt-2">
                                        <input type="number" min="1" className="border rounded px-2 py-1 w-20" value={inputQty} onChange={e => setInputQty(Number(e.target.value))} />
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg" onClick={addToCart}>Tambah ke Cart</button>
                                    </div>
                                </div>
                            )}
                            <div className="overflow-x-auto bg-white rounded-lg shadow border border-blue-100">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="bg-blue-50">
                                            <th className="p-2 text-left">Nama</th>
                                            <th className="p-2 text-left">Barcode</th>
                                            <th className="p-2 text-left">Harga</th>
                                            <th className="p-2 text-left">Qty</th>
                                            <th className="p-2 text-left">Subtotal</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.product_id}>
                                                <td className="p-2">{item.product_name}</td>
                                                <td className="p-2">{item.barcode}</td>
                                                <td className="p-2">Rp{Number(item.price).toLocaleString('id-ID')}</td>
                                                <td className="p-2">{item.quantity}</td>
                                                <td className="p-2">Rp{Number(item.subtotal).toLocaleString('id-ID')}</td>
                                                <td className="p-2"><button className="text-red-500 hover:underline" onClick={() => removeFromCart(item.product_id)}>Hapus</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Right: Payment & Customer */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="mb-2 text-lg font-semibold">Total: <span className="text-blue-700">Rp{total}</span></div>
                            <div className="mb-2">
                                <label className="block font-medium">Diskon</label>
                                <input type="number" className="border border-blue-200 rounded-lg px-3 py-2 w-full" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                            </div>
                            <div className="mb-2">
                                <label className="block font-medium">Pajak</label>
                                <input type="number" className="border border-blue-200 rounded-lg px-3 py-2 w-full" value={tax} onChange={e => setTax(Number(e.target.value))} />
                            </div>
                            <div className="mb-2 text-xl font-bold">Grand Total: <span className="text-green-700">Rp{grandTotal}</span></div>
                            <div className="mb-2">
                                <label className="block font-medium">Nama Pelanggan</label>
                                <input type="text" className="border border-blue-200 rounded-lg px-3 py-2 w-full" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                            </div>
                            <div className="mb-2">
                            <label className="block font-medium">No. HP Pelanggan</label>
                            <input type="text" className="border border-blue-200 rounded-lg px-3 py-2 w-full" value={customerContact} onChange={e => setCustomerContact(e.target.value)} />
                            </div>
                            <div className="mb-2">
                                <label className="block font-medium">Pembayaran</label>
                                <div className="flex gap-2">
                                    <select className="border border-blue-200 rounded-lg px-3 py-2" value={paymentType} onChange={e => setPaymentType(e.target.value)}>
                                        <option value="cash">Cash</option>
                                        <option value="debit">Debit</option>
                                        <option value="ewallet">E-Wallet</option>
                                    </select>
                                    <input type="text" className="border border-blue-200 rounded-lg px-3 py-2 flex-1" placeholder="Detail pembayaran (opsional)" value={paymentDetails} onChange={e => setPaymentDetails(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold w-full" onClick={handleSubmit}>Simpan Transaksi</button>
                                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold w-full" onClick={handleHold}>Hold Cart</button>
                            </div>
                            <div className="mt-2">
                                <input type="text" className="border border-blue-200 rounded-lg px-3 py-2 w-full" placeholder="Catatan hold cart" value={holdNote} onChange={e => setHoldNote(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
