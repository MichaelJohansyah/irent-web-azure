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
                        <div key={order.id} className="rounded-xl bg-card text-foreground p-4 shadow border border-sidebar-border/70 flex flex-col md:flex-row gap-4 items-center">
                            {order.product ? (
                                <img src={order.product.image ? `/storage/${order.product.image}` : '/images/products/default.png'} alt={order.product.name} className="h-24 w-24 rounded-lg object-cover border border-muted" />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-muted">No Image</div>
                            )}
                            <div className="flex-1 flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-foreground mb-1">{order.product ? order.product.name : 'Product not found'}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span>{new Date(order.start_date).toLocaleDateString()} - {new Date(order.end_date).toLocaleDateString()}</span>
                                    <span>{order.duration} days</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold text-primary text-base">Rp{order.total_price.toLocaleString()}</span>
                                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ml-2 ${getStatusBadgeColor(order.status)}`}>{order.status}</span>
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
