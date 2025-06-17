import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Order {
    id: number;
    product: {
        name: string;
        image: string;
    };
    customer?: {
        name: string;
    };
    partner?: {
        name: string;
    };
    start_date: string;
    end_date: string;
    duration: number;
    total_price: number;
    status: 'waiting' | 'ready' | 'rented' | 'return_now' | 'finished' | 'canceled';
}

interface ManageOrdersProps {
    orders: Order[];
}

const statusOptions = [
    { value: 'waiting', label: 'Waiting' },
    { value: 'ready', label: 'Ready' },
    { value: 'rented', label: 'Rented' },
    { value: 'return_now', label: 'Return Now' },
    { value: 'finished', label: 'Finished' },
];

const statusColors: Record<Order['status'], string> = {
    waiting: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-blue-100 text-blue-800',
    rented: 'bg-green-100 text-green-800',
    return_now: 'bg-red-100 text-red-800',
    finished: 'bg-gray-100 text-gray-800',
    canceled: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
};

export default function ManageOrders({ orders }: ManageOrdersProps) {
    const [updating, setUpdating] = useState<number | null>(null);

    const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
        setUpdating(orderId);
        router.post(
            `/admin/orders/${orderId}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onFinish: () => setUpdating(null),
            },
        );
    };

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Manage Orders', href: '/admin/orders' }]}>
            <Head title="Manage Orders" />
            <div className="p-8">
                <h1 className="mb-6 text-2xl font-semibold">Manage Orders</h1>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-card text-foreground border-sidebar-border/70 flex flex-col items-center gap-4 rounded-xl border p-4 shadow md:flex-row"
                        >
                            {order.product ? (
                                <img
                                    src={order.product.image ? `/storage/${order.product.image}` : '/images/products/default.png'}
                                    alt={order.product.name}
                                    className="border-muted h-24 w-24 rounded-lg border object-cover"
                                />
                            ) : (
                                <div className="bg-muted text-muted-foreground border-muted flex h-24 w-24 items-center justify-center rounded-lg border">
                                    No Image
                                </div>
                            )}
                            <div className="flex flex-1 flex-col gap-1">
                                <h3 className="text-foreground mb-1 text-lg font-bold">{order.product ? order.product.name : 'Product not found'}</h3>
                                <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                                    <span>
                                        {formatDate(order.start_date)} - {formatDate(order.end_date)}
                                    </span>
                                    <span>
                                        {order.duration} day{order.duration > 1 ? 's' : ''}
                                    </span>
                                    {order.customer && <span>Customer: {order.customer.name}</span>}
                                    {order.partner && <span>Partner: {order.partner.name}</span>}
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-primary text-base font-bold">Rp{order.total_price.toLocaleString()}</span>
                                    <select
                                        className={`ml-2 rounded border px-2 py-1 text-xs font-medium transition-colors duration-150 outline-none ${statusColors[order.status]}`}
                                        value={order.status}
                                        disabled={updating === order.id}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        style={{ minWidth: 110 }}
                                    >
                                        {statusOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <div className="py-8 text-center text-gray-500">No orders found.</div>}
                </div>
            </div>
        </AppSidebarLayout>
    );
}
