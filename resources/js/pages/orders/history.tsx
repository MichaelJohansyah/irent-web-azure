import AppLayout from '@/layouts/app-layout';

interface Order {
    id: number;
    product: {
        name: string;
        image: string;
    };
    customer?: {
        name: string;
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
        <AppLayout breadcrumbs={[{ title: 'Order List', href: '/orders' }]}>
            <div className="p-8">
                <h1 className="mb-6 text-2xl font-semibold">Order List</h1>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="rounded-lg bg-white p-4 shadow">
                            <div className="flex items-center gap-4">
                                {order.product ? (
                                    <img src={order.product.image} alt={order.product.name} className="h-24 w-24 rounded-md object-cover" />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-200 text-gray-400">No Image</div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{order.product ? order.product.name : 'Product not found'}</h3>
                                    {order.customer && <p className="font-medium text-gray-700">Customer: {order.customer.name}</p>}
                                    <p className="text-gray-600">
                                        {new Date(order.start_date).toLocaleDateString()} - {new Date(order.end_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">{order.duration} hari</p>
                                    <p className="font-semibold">Rp{order.total_price.toLocaleString()}</p>
                                    <span className={`inline-block rounded-full px-2 py-1 text-sm ${getStatusBadgeColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <div className="py-8 text-center text-gray-500">No orders found.</div>}
                </div>
            </div>
        </AppLayout>
    );
}
