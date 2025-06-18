import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    waiting: 'bg-gray-800 text-white', // dark grey
    ready: 'bg-blue-600 text-white',   // blue
    rented: 'bg-green-600 text-white', // green
    return_now: 'bg-yellow-400 text-gray-900', // yellow
    finished: 'bg-white text-gray-900 border border-gray-300', // white
    canceled: 'bg-red-600 text-white', // red
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
};

export default function ManageOrders({ orders }: ManageOrdersProps) {
    const [selectedOrder, setSelectedOrder] = useState<(Order & { return_information?: string }) | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    // Track which order is being edited (for status dropdown)
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);

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

    // Filter orders based on search
    const filteredOrders = orders.filter((order) => {
        const productName = order.product?.name?.toLowerCase() || '';
        const customerName = order.customer?.name?.toLowerCase() || '';
        const partnerName = order.partner?.name?.toLowerCase() || '';
        const status = order.status?.toLowerCase() || '';
        const q = search.toLowerCase();
        return productName.includes(q) || customerName.includes(q) || partnerName.includes(q) || status.includes(q);
    });

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Manage Orders', href: '/admin/orders' }]}>
            <Head title="Manage Orders" />
            <div className="p-8">
                <h1 className="mb-6 text-2xl font-semibold">Manage Orders</h1>
                <input
                    type="text"
                    placeholder="Search by product, customer, partner, or status..."
                    className="mb-4 w-full rounded border px-3 py-2 text-base"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-card text-foreground border-sidebar-border/70 hover:bg-muted/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-4 shadow md:flex-row"
                            onClick={e => {
                                // Only open summary if not clicking the dropdown
                                if (
                                    e.target instanceof HTMLElement &&
                                    (e.target.tagName === 'SELECT' || e.target.closest('select'))
                                ) {
                                    setEditingOrderId(order.id);
                                    return;
                                }
                                setSelectedOrder(order);
                            }}
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
                                        onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        style={{ minWidth: 110 }}
                                        onClick={e => {
                                            // Prevent parent div onClick when clicking dropdown
                                            e.stopPropagation();
                                            setEditingOrderId(order.id);
                                        }}
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
                    {filteredOrders.length === 0 && <div className="py-8 text-center text-gray-500">No orders found.</div>}
                </div>
                {/* Admin order summary dialog for finished orders */}
                <Dialog open={!!selectedOrder && selectedOrder.status === 'finished'} onOpenChange={() => setSelectedOrder(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Order Summary</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            <div>
                                <span className="font-semibold">Customer Name:</span> {selectedOrder?.customer?.name || '-'}
                            </div>
                            <div>
                                <span className="font-semibold">Partner Name:</span> {selectedOrder?.partner?.name || '-'}
                            </div>
                            <div>
                                <span className="font-semibold">Return Information:</span> {selectedOrder?.return_information || '-'}
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <button className="rounded bg-blue-600 px-4 py-2 text-white">Close</button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppSidebarLayout>
    );
}
