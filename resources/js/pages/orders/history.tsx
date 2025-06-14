import { Link } from "@inertiajs/react";

interface Order {
    id: number;
    product: {
        name: string;
        image: string;
    };
    start_date: string;
    end_date: string;
    duration: number;
    total_price: number;
    status: 'waiting' | 'ready' | 'rented' | 'return_now' | 'finished' | 'canceled';
}

interface HistoryProps {
    orders: Order[];
}

export default function History({ orders }: HistoryProps) {
    const getStatusBadgeColor = (status: Order['status']) => {
        const colors = {
            waiting: 'bg-yellow-100 text-yellow-800',
            ready: 'bg-blue-100 text-blue-800',
            rented: 'bg-green-100 text-green-800',
            return_now: 'bg-red-100 text-red-800',
            finished: 'bg-gray-100 text-gray-800',
            canceled: 'bg-red-100 text-red-800',
        };
        return colors[status];
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">Riwayat Transaksi</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center gap-4">
                            <img 
                                src={order.product.image} 
                                alt={order.product.name}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{order.product.name}</h3>
                                <p className="text-gray-600">
                                    {new Date(order.start_date).toLocaleDateString()} - {new Date(order.end_date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">{order.duration} hari</p>
                                <p className="font-semibold">Rp{order.total_price.toLocaleString()}</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Belum ada transaksi
                    </div>
                )}
            </div>
        </div>
    );
}