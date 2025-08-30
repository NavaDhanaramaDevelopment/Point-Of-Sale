import React, { useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PosIndex({ outlets = [], userRole, userOutletId }) {
    const [barcode, setBarcode] = useState('');
    const [cart, setCart] = useState([]);
    const [inputQty, setInputQty] = useState(1);
    const [product, setProduct] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [selectedOutletId, setSelectedOutletId] = useState(userOutletId || '');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerResults, setCustomerResults] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showCreateCustomer, setShowCreateCustomer] = useState(false);
    const [paymentType, setPaymentType] = useState('cash');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [holdNote, setHoldNote] = useState('');
    const [message, setMessage] = useState('');

    const handleBarcodeChange = (value) => {
        setBarcode(value);
        // Clear product and message when barcode changes
        if (!value) {
            setProduct(null);
            setMessage('');
        }
    };

    const handleScan = async () => {
        if (!barcode) return;

        // Check if outlet is selected for managers
        if (userRole === 'manager' && !selectedOutletId) {
            setMessage('Pilih outlet terlebih dahulu');
            return;
        }

        // For non-managers, use userOutletId; for managers, use selectedOutletId
        const outletToUse = userRole === 'manager' ? selectedOutletId : userOutletId;

        try {
            const res = await axios.post(route('pos.scanBarcode'), {
                barcode,
                outlet_id: outletToUse
            });

            if (res.data.length > 0 || res.data.id) {
                setProduct(res.data);
                setMessage('');
            } else {
                setProduct(null);
                setMessage(`Produk dengan barcode/nama "${barcode}" tidak ditemukan atau tidak tersedia di outlet ini`);
            }
        } catch (error) {
            setProduct(null);
            setMessage('Terjadi kesalahan saat mencari produk');
        }
    };

    const searchCustomers = async (search) => {
        if (!search || search.length < 2) {
            setCustomerResults([]);
            return;
        }

        // For non-managers, use userOutletId; for managers, use selectedOutletId
        const outletToUse = userRole === 'manager' ? selectedOutletId : userOutletId;

        try {
            const response = await axios.get(route('pos.searchCustomers'), {
                params: {
                    search: search,
                    outlet_id: outletToUse
                }
            });
            setCustomerResults(response.data);
        } catch (error) {
            console.error('Error searching customers:', error);
        }
    };

    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerName(customer.name);
        setCustomerPhone(customer.phone);
        setCustomerSearch(customer.name);
        setCustomerResults([]);
        setShowCustomerModal(false);
    };

    const clearCustomer = () => {
        setSelectedCustomer(null);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerSearch('');
        setCustomerResults([]);
    };

    const createNewCustomer = async () => {
        if (!customerName || !customerPhone) {
            setMessage('Nama dan nomor telepon harus diisi');
            return;
        }

        if (userRole === 'manager' && !selectedOutletId) {
            setMessage('Pilih outlet terlebih dahulu');
            return;
        }

        // For non-managers, use userOutletId; for managers, use selectedOutletId
        const outletToUse = userRole === 'manager' ? selectedOutletId : userOutletId;

        try {
            const response = await axios.post(route('pos.findOrCreateCustomer'), {
                name: customerName,
                phone: customerPhone,
                outlet_id: outletToUse
            });

            setSelectedCustomer(response.data);
            setShowCreateCustomer(false);
            setMessage('Customer berhasil ditambahkan');
        } catch (error) {
            setMessage('Gagal menambahkan customer: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const addToCart = () => {
        if (!product) return;

        // Check stock availability
        const availableStock = product.actual_stock || product.stock_quantity || 0;
        if (availableStock <= 0) {
            setMessage('Stok produk tidak mencukupi');
            return;
        }

        if (inputQty > availableStock) {
            setMessage(`Stok tidak mencukupi. Stok tersedia: ${availableStock}`);
            return;
        }

        // Use selling_price instead of price
        const price = Number(product.selling_price) || 0;
        const qty = Number(inputQty) || 1;
        const exists = cart.find(item => item.product_id === product.id);

        if (exists) {
            const newQty = exists.quantity + qty;
            if (newQty > availableStock) {
                setMessage(`Total quantity melebihi stok. Stok tersedia: ${availableStock}, sudah di cart: ${exists.quantity}`);
                return;
            }
            setCart(cart.map(item => item.product_id === product.id ?
                { ...item, quantity: newQty, subtotal: newQty * price } : item
            ));
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
        setMessage(''); // Clear any previous error messages
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.product_id !== id));
    };

    const total = cart.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
    const grandTotal = total - (Number(discount) || 0) + (Number(tax) || 0);

    const handleSubmit = async () => {
        if (cart.length === 0) return;

        if (userRole === 'manager' && !selectedOutletId) {
            setMessage('Pilih outlet terlebih dahulu');
            return;
        }

        // For non-managers, use userOutletId; for managers, use selectedOutletId
        const outletToUse = userRole === 'manager' ? selectedOutletId : userOutletId;

        const submitData = {
            items: cart,
            total,
            discount,
            tax,
            grand_total: grandTotal,
            payment_method: paymentType,
            note: paymentDetails,
            outlet_id: outletToUse
        };

        // Add customer data
        if (selectedCustomer) {
            submitData.customer_id = selectedCustomer.id;
        } else if (customerName && customerPhone) {
            submitData.customer_name = customerName;
            submitData.customer_phone = customerPhone;
        }

        try {
            await axios.post(route('pos.store'), submitData);
            setCart([]);
            clearCustomer();
            setDiscount(0);
            setTax(0);
            setPaymentDetails('');
            setMessage('Transaksi berhasil!');
        } catch (error) {
            setMessage('Gagal menyimpan transaksi: ' + (error.response?.data?.message || 'Unknown error'));
        }
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
                    {message && <div className="mb-4 text-center font-semibold" style={{ color: message.includes('berhasil') ? 'green' : message.includes('Gagal') ? 'red' : 'orange' }}>{message}</div>}

                    {/* Debug info for non-managers */}
                    {userRole !== 'manager' && userOutletId && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm text-blue-700">
                                <strong>Role:</strong> {userRole} | <strong>Outlet:</strong> {userOutletId}
                            </div>
                        </div>
                    )}

                    {/* Outlet Selection for Manager */}
                    {userRole === 'manager' && outlets.length > 0 && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Outlet:</label>
                            <select
                                value={selectedOutletId}
                                onChange={(e) => setSelectedOutletId(e.target.value)}
                                className="w-full border border-yellow-300 rounded-lg px-3 py-2"
                            >
                                <option value="">-- Pilih Outlet --</option>
                                {outlets.map(outlet => (
                                    <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Cart & Scan */}
                        <div className="flex-1">
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    className="border border-blue-200 rounded-lg px-3 py-2 w-full"
                                    placeholder="Scan/masukkan barcode atau nama produk"
                                    value={barcode}
                                    onChange={e => handleBarcodeChange(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleScan()}
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={handleScan}>Scan</button>
                            </div>

                            {/* Product Display - Show result or not found message */}
                            {barcode && (
                                <>
                                    {product ? (
                                        <div className="mb-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
                                            <div className="font-semibold">{product.name}</div>
                                            <div>Harga: <b>Rp{Number(product.selling_price || 0).toLocaleString('id-ID')}</b></div>
                                            <div>Stok: {product.actual_stock || product.stock_quantity || 0}</div>
                                            <div className="flex gap-2 mt-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={product.actual_stock || product.stock_quantity || 0}
                                                    className="border rounded px-2 py-1 w-20"
                                                    value={inputQty}
                                                    onChange={e => setInputQty(Number(e.target.value))}
                                                />
                                                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg" onClick={addToCart}>Tambah ke Cart</button>
                                            </div>
                                        </div>
                                    ) : message && message.includes('tidak ditemukan') && (
                                        <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50">
                                            <div className="text-red-700">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-semibold">Produk Tidak Ditemukan</span>
                                                </div>
                                                <div className="mt-1 text-sm">
                                                    Produk dengan kode/nama "{barcode}" tidak tersedia di outlet ini.
                                                </div>
                                                <div className="mt-2 text-xs">
                                                    • Pastikan barcode/nama produk sudah benar<br/>
                                                    • Produk mungkin berada di outlet lain<br/>
                                                    • Atau produk belum ditambahkan ke sistem
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
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
                            <div className="mb-2 text-lg font-semibold">Total: <span className="text-blue-700">Rp{total.toLocaleString('id-ID')}</span></div>
                            <div className="mb-2">
                                <label className="block font-medium">Diskon</label>
                                <input type="number" className="border border-blue-200 rounded-lg px-3 py-2 w-full" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                            </div>
                            <div className="mb-2">
                                <label className="block font-medium">Pajak</label>
                                <input type="number" className="border border-blue-200 rounded-lg px-3 py-2 w-full" value={tax} onChange={e => setTax(Number(e.target.value))} />
                            </div>
                            <div className="mb-2 text-xl font-bold">Grand Total: <span className="text-green-700">Rp{grandTotal.toLocaleString('id-ID')}</span></div>

                            {/* Customer Section */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <label className="block font-medium mb-2">Customer</label>
                                {selectedCustomer ? (
                                    <div className="flex items-center justify-between bg-green-50 p-2 rounded border">
                                        <div>
                                            <div className="font-semibold">{selectedCustomer.name}</div>
                                            <div className="text-sm text-gray-600">{selectedCustomer.phone}</div>
                                            <div className="text-xs text-green-600">Poin: {selectedCustomer.points || 0}</div>
                                        </div>
                                        <button onClick={clearCustomer} className="text-red-500 hover:underline text-sm">Hapus</button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowCustomerModal(true)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Cari Customer
                                            </button>
                                            <button
                                                onClick={() => setShowCreateCustomer(true)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Customer Baru
                                            </button>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Nama pelanggan (opsional)"
                                                className="border border-gray-300 rounded px-3 py-1 w-full text-sm"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="No. HP pelanggan (opsional)"
                                                className="border border-gray-300 rounded px-3 py-1 w-full text-sm"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
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

            {/* Customer Search Modal */}
            {showCustomerModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Cari Customer</h3>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Masukkan nama atau nomor HP..."
                                    value={customerSearch}
                                    onChange={(e) => {
                                        setCustomerSearch(e.target.value);
                                        searchCustomers(e.target.value);
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {customerResults.map(customer => (
                                    <div
                                        key={customer.id}
                                        onClick={() => selectCustomer(customer)}
                                        className="p-3 border-b cursor-pointer hover:bg-gray-50"
                                    >
                                        <div className="font-semibold">{customer.name}</div>
                                        <div className="text-sm text-gray-600">{customer.phone}</div>
                                        <div className="text-xs text-green-600">Poin: {customer.points || 0} | Kunjungan: {customer.visit_count || 0}</div>
                                    </div>
                                ))}
                                {customerSearch && customerResults.length === 0 && (
                                    <div className="p-3 text-gray-500 text-center">Tidak ada customer ditemukan</div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowCustomerModal(false);
                                        setCustomerSearch('');
                                        setCustomerResults([]);
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Customer Modal */}
            {showCreateCustomer && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Baru</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama *</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nomor HP *</label>
                                    <input
                                        type="text"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowCreateCustomer(false);
                                        setCustomerName('');
                                        setCustomerPhone('');
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={createNewCustomer}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
