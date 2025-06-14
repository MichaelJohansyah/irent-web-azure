import { Link, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    storage: string;
    color: string;
    rent_price: number;
    max_rent_day: number;
    stock: number;
    image: string;
    partner?: { name: string };
}

interface ConfirmProps {
    product: Product;
}

export default function Confirm({ product }: ConfirmProps) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        partner_id: product.partner?.id,
        duration: 1,
        start_date: new Date().toISOString().split('T')[0],
    });

    // Calculate total price based on duration
    const totalPrice = useMemo(() => {
        return product.rent_price * data.duration;
    }, [product.rent_price, data.duration]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'), {
            onSuccess: () => {
                // This will redirect to transaction history
                window.location.href = route('orders.index');
            },
        });
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold">Konfirmasi Pesanan</h1>

            <div className="bg-muted p-4 rounded-md mt-4">
                <h2 className="text-lg font-semibold">Produk</h2>
                <p>Nama: {product.name}</p>
                <p>Harga Sewa per Hari: Rp{product.rent_price.toLocaleString()}</p>
                <p>Durasi Maksimal Sewa: {product.max_rent_day} hari</p>

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block">Durasi Sewa (hari)</label>
                            <input
                                type="number"
                                min="1"
                                max={product.max_rent_day}
                                value={data.duration}
                                onChange={e => setData('duration', parseInt(e.target.value))}
                                className="rounded-md border p-2"
                            />
                            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                        </div>

                        <div>
                            <label className="block">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="rounded-md border p-2"
                            />
                            {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                        </div>

                        {/* Add total price display */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-semibold">Ringkasan Biaya:</h3>
                            <p>Harga per hari: Rp{product.rent_price.toLocaleString()}</p>
                            <p>Durasi: {data.duration} hari</p>
                            <p className="text-lg font-bold mt-2">
                                Total: Rp{totalPrice.toLocaleString()}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 text-gray-50 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition w-full">
                            {processing ? 'Processing...' : 'Konfirmasi Pesanan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
