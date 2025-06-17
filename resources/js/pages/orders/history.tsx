import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
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
    start_date: string;
    end_date: string;
    duration: number;
    total_price: number;
    status: 'waiting' | 'ready' | 'rented' | 'return_now' | 'finished' | 'canceled';
    pickup_address?: string;
    contact_number?: string;
    pickup_time?: string;
    notes?: string;
}

interface HistoryProps {
    orders: Order[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID'); // Indonesian format: dd/mm/yyyy
};

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

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [form, setForm] = useState({
        pickup_address: '',
        contact_number: '',
        pickup_time: '',
        notes: '',
    });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleOpen = (order: Order) => {
        setSelectedOrder(order);
        setForm({ pickup_address: '', contact_number: '', pickup_time: '', notes: '' });
        setError('');
    };
    const handleCustomerOpen = (order: Order) => {
        setSelectedOrder(order);
    };
    const handleClose = () => {
        setSelectedOrder(null);
        setError('');
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleConfirm = async () => {
        if (!form.pickup_address || !form.contact_number || !form.pickup_time) {
            setError('Please fill all required fields.');
            return;
        }
        setProcessing(true);
        await fetch(`/orders/${selectedOrder?.id}/partner-confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ ...form, status: 'ready' }),
        });
        setProcessing(false);
        setSelectedOrder(null);
        window.location.reload();
    };
    const handleCancel = async () => {
        setProcessing(true);
        await fetch(`/orders/${selectedOrder?.id}/partner-cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ status: 'canceled' }),
        });
        setProcessing(false);
        setSelectedOrder(null);
        window.location.reload();
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Order List', href: '/orders' }]}>
            <div className="p-8">
                <h1 className="mb-6 text-2xl font-semibold">Order List</h1>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className={`bg-card text-foreground border-sidebar-border/70 flex flex-col items-center gap-4 rounded-xl border p-4 shadow md:flex-row ${order.status === 'ready' ? 'hover:bg-muted/40 cursor-pointer' : ''}`}
                            onClick={() => (order.status === 'ready' ? setSelectedOrder(order) : undefined)}
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
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-primary text-base font-bold">Rp{order.total_price.toLocaleString()}</span>
                                    <span
                                        className={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <div className="py-8 text-center text-gray-500">No orders found.</div>}
                </div>
                {/* Customer info modal (for customers) */}
                <Dialog open={!!selectedOrder && selectedOrder.status === 'ready'} onOpenChange={handleClose}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Pickup Information</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            <div>
                                <span className="font-semibold">Pickup Address:</span> {selectedOrder?.pickup_address || '-'}
                            </div>
                            <div>
                                <span className="font-semibold">Contact Number:</span> {selectedOrder?.contact_number || '-'}
                            </div>
                            <div>
                                <span className="font-semibold">Pickup Time:</span> {selectedOrder?.pickup_time || '-'}
                            </div>
                            <div>
                                <span className="font-semibold">Additional Notes:</span> {selectedOrder?.notes || '-'}
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
        </AppLayout>
    );
}
