import React, { useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';

export default function Refund() {
    const [saleId, setSaleId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    const handleRefund = async () => {
        if (!saleId || !amount) return;
        await axios.post(route('pos.refund'), {
            sale_id: saleId,
            amount,
            reason,
        }).then(() => {
            setMessage('Permintaan refund berhasil dikirim!');
            setSaleId('');
            setAmount('');
            setReason('');
        }).catch(e => {
            setMessage('Gagal mengirim refund');
        });
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Refund Penjualan</h1>
            {message && <div className="mb-2 text-green-600">{message}</div>}
            <div className="mb-2">
                ID Penjualan: <input type="text" className="border p-1 w-48" value={saleId} onChange={e => setSaleId(e.target.value)} />
            </div>
            <div className="mb-2">
                Nominal Refund: <input type="number" className="border p-1 w-48" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="mb-2">
                Alasan: <input type="text" className="border p-1 w-64" value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <button className="bg-red-500 text-white px-4 py-2" onClick={handleRefund}>Kirim Refund</button>
        </div>
    );
}
