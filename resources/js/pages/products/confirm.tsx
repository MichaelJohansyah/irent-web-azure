import { Link } from "@inertiajs/react";

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
    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold">Konfirmasi Pesanan</h1>

            <div className="bg-muted p-4 rounded-md mt-4">
                <h2 className="text-lg font-semibold">Produk</h2>
                <p>Nama: {product.name}</p>
                <p>Harga Sewa per Hari: Rp{product.rent_price.toLocaleString()}</p>
                <p>Durasi Maksimal Sewa: {product.max_rent_day} hari</p>

                {/* Tombol Confirm */}
                <Link
                    href={route('products.confirm', { id: product.id })}
                    className="bg-blue-500 text-gray-50 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition mt-4 inline-block">
                    Konfirmasi Pesanan
                </Link>
            </div>
        </div>
    );
}
