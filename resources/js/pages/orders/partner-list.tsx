import { Dialog as ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useRef, useState } from 'react';

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
    status: 'waiting' | 'ready' | 'rented' | 'return_now' | 'canceled' | 'finished';
    pickup_address?: string;
    contact_number?: string;
    pickup_time?: string;
    notes?: string;
    return_information?: string; // new field for return summary
}

interface PartnerOrdersProps {
    orders: Order[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
};

// Helper to get time left in ms
function getTimeLeft(endDate: string) {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    return end - now;
}

function formatCountdown(ms: number) {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Spinner loader
const loaderStyle = `
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.loader { border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; width: 1em; height: 1em; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; }
`;
if (typeof window !== 'undefined' && !document.getElementById('partner-orders-loader-style')) {
    const style = document.createElement('style');
    style.id = 'partner-orders-loader-style';
    style.innerHTML = loaderStyle;
    document.head.appendChild(style);
}

export default function PartnerOrders({ orders }: PartnerOrdersProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [form, setForm] = useState({
        pickup_address: '',
        contact_number: '',
        pickup_time: '',
        notes: '',
        return_information: '', // new field
    });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [csrfToken, setCsrfToken] = useState<string>('');
    const [countdowns, setCountdowns] = useState<{ [orderId: number]: number }>({});
    const [showConfirm, setShowConfirm] = useState<{ action: null | string; onConfirm: null | (() => void) }>({ action: null, onConfirm: null });
    const countdownIntervals = useRef<{ [orderId: number]: NodeJS.Timeout }>({});

    useEffect(() => {
        // Get CSRF token from meta tag (Laravel default)
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        setCsrfToken(token);
    }, []);

    useEffect(() => {
        const rentedOrders = orders.filter((o) => o.status === 'rented');
        rentedOrders.forEach((order) => {
            if (countdownIntervals.current[order.id]) return; // already running
            const updateCountdown = () => {
                const msLeft = getTimeLeft(order.end_date);
                setCountdowns((prev) => ({ ...prev, [order.id]: msLeft }));
                if (msLeft <= 0) {
                    clearInterval(countdownIntervals.current[order.id]);
                    delete countdownIntervals.current[order.id];
                    // Auto-update status to return_now
                    fetch(`/orders/${order.id}/admin/orders/update-status`, {
                        method: 'POST',
                        headers: apiHeaders,
                        credentials: 'same-origin',
                        body: JSON.stringify({ status: 'return_now' }),
                    }).then(() => window.location.reload());
                }
            };
            updateCountdown();
            countdownIntervals.current[order.id] = setInterval(updateCountdown, 1000);
        });
        // Cleanup on unmount
        return () => {
            Object.values(countdownIntervals.current).forEach(clearInterval);
        };
    }, [orders, csrfToken]);

    const handleOpen = (order: Order) => {
        setSelectedOrder(order);
        setForm({
            pickup_address: order.pickup_address || '',
            contact_number: order.contact_number || '',
            pickup_time: order.pickup_time || '',
            notes: order.notes || '',
            return_information: order.return_information || '', // new field
        });
        setError('');
    };
    const handleClose = () => {
        setSelectedOrder(null);
        setError('');
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    // Confirmation wrapper
    const confirmAction = (action: string, fn: () => void) => {
        setShowConfirm({
            action,
            onConfirm: () => {
                setShowConfirm({ action: null, onConfirm: null });
                fn();
            },
        });
    };
    // Reusable headers for fetch requests
    const apiHeaders = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken,
    };

    // Separate confirm and save changes logic
    const handleConfirmOrder = async () => {
        if (!form.pickup_address || !form.contact_number || !form.pickup_time) {
            setError('Please fill all required fields.');
            return;
        }
        setProcessing(true);
        try {
            const res = await fetch(`/orders/${selectedOrder?.id}/partner-confirm`, {
                method: 'POST',
                headers: apiHeaders,
                credentials: 'same-origin',
                body: JSON.stringify({ ...form, status: 'ready' }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError('Failed to confirm order.');
                console.error('Confirm error:', data);
            } else {
                setSelectedOrder(null);
                window.location.reload();
            }
        } catch (err) {
            setError('Network error.');
            console.error('Network error:', err);
        }
        setProcessing(false);
    };
    const handleSaveChanges = async () => {
        if (!form.pickup_address || !form.contact_number || !form.pickup_time) {
            setError('Please fill all required fields.');
            return;
        }
        setProcessing(true);
        try {
            const res = await fetch(`/orders/${selectedOrder?.id}/partner-confirm`, {
                method: 'POST',
                headers: apiHeaders,
                credentials: 'same-origin',
                body: JSON.stringify({
                    ...form, // includes return_information
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError('Failed to save changes.');
                console.error('Save changes error:', data);
            } else {
                setSelectedOrder(null);
                window.location.reload();
            }
        } catch (err) {
            setError('Network error.');
            console.error('Network error:', err);
        }
        setProcessing(false);
    };
    const handleCancel = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`/orders/${selectedOrder?.id}/partner-cancel`, {
                method: 'POST',
                headers: apiHeaders,
                credentials: 'same-origin',
                body: JSON.stringify({ status: 'canceled' }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError('Failed to cancel order.');
                console.error('Cancel error:', data);
            } else {
                setSelectedOrder(null);
                window.location.reload();
            }
        } catch (err) {
            setError('Network error.');
            console.error('Network error:', err);
        }
        setProcessing(false);
    };
    // Handler to set status to 'rented'
    const handlePickedUp = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`/orders/${selectedOrder?.id}/partner-pickedup`, {
                method: 'POST',
                headers: apiHeaders,
                credentials: 'same-origin',
                body: JSON.stringify({ status: 'rented' }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError('Failed to update order to rented.');
                console.error('Picked up error:', data);
            } else {
                setSelectedOrder(null);
                window.location.reload();
            }
        } catch (err) {
            setError('Network error.');
            console.error('Network error:', err);
        }
        setProcessing(false);
    };
    // Handler to set status to 'finished'
    const handleFinishOrder = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`/orders/${selectedOrder?.id}/partner-finish`, {
                method: 'POST',
                headers: apiHeaders,
                credentials: 'same-origin',
                body: JSON.stringify({
                    status: 'finished',
                    return_information: form.return_information, // send return_information
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError('Failed to finish order.');
                console.error('Finish error:', data);
            } else {
                setSelectedOrder(null);
                window.location.reload();
            }
        } catch (err) {
            setError('Network error.');
            console.error('Network error:', err);
        }
        setProcessing(false);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Partner Orders', href: '/orders/partner-list' }]}>
            <div className="p-8">
                <h1 className="mb-6 text-2xl font-semibold">Partner Orders</h1>
                <div className="space-y-4">
                    {orders.map((order) => {
                        // Allow clickable for waiting, ready, rented, return_now, and finished
                        const clickable =
                            order.status === 'waiting' ||
                            order.status === 'ready' ||
                            order.status === 'rented' ||
                            order.status === 'return_now' ||
                            order.status === 'finished';
                        return (
                            <div
                                key={order.id}
                                className={`bg-card text-foreground border-sidebar-border/70 flex flex-col items-center gap-4 rounded-xl border p-4 shadow md:flex-row ${clickable ? 'hover:bg-muted/40 cursor-pointer' : ''}`}
                                onClick={() => (clickable ? handleOpen(order) : undefined)}
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
                                    <h3 className="text-foreground mb-1 text-lg font-bold">
                                        {order.product ? order.product.name : 'Product not found'}
                                    </h3>
                                    <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                                        <span>
                                            {formatDate(order.start_date)} - {formatDate(order.end_date)}
                                        </span>
                                        <span>
                                            {order.duration} day{order.duration > 1 ? 's' : ''}
                                        </span>
                                        {order.customer && <span>Customer: {order.customer.name}</span>}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-primary text-base font-bold">Rp{order.total_price.toLocaleString()}</span>
                                        <span
                                            className={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                order.status === 'waiting'
                                                    ? 'bg-gray-800 text-white'
                                                    : order.status === 'ready'
                                                        ? 'bg-blue-600 text-white'
                                                        : order.status === 'rented'
                                                            ? 'bg-green-600 text-white'
                                                            : order.status === 'return_now'
                                                                ? 'bg-yellow-400 text-gray-900'
                                                                : order.status === 'finished'
                                                                    ? 'bg-white text-gray-900 border border-gray-300'
                                                                    : order.status === 'canceled'
                                                                        ? 'bg-red-600 text-white'
                                                                        : ''
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                        {order.status === 'rented' && (
                                            <span className="ml-4 text-sm font-semibold text-green-700">
                                                Countdown: {formatCountdown(countdowns[order.id] ?? getTimeLeft(order.end_date))}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {orders.length === 0 && <div className="py-8 text-center text-gray-500">No orders found.</div>}
                </div>
                <Dialog open={!!selectedOrder} onOpenChange={handleClose}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedOrder?.status === 'waiting'
                                    ? 'Confirm Order'
                                    : selectedOrder?.status === 'finished'
                                      ? 'Order Summary'
                                      : 'Edit Pickup Info'}
                            </DialogTitle>
                        </DialogHeader>
                        {selectedOrder?.status === 'finished' ? (
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
                        ) : (
                            <div className="flex flex-col gap-3">
                                <input
                                    name="pickup_address"
                                    value={form.pickup_address}
                                    onChange={handleChange}
                                    placeholder="Pickup Address"
                                    className="rounded border p-2"
                                    required
                                    disabled={['finished', 'canceled'].includes(selectedOrder?.status as string)}
                                />
                                <input
                                    name="contact_number"
                                    value={form.contact_number}
                                    onChange={handleChange}
                                    placeholder="Contact Number"
                                    className="rounded border p-2"
                                    required
                                    disabled={['finished', 'canceled'].includes(selectedOrder?.status as string)}
                                />
                                <input
                                    name="pickup_time"
                                    value={form.pickup_time}
                                    onChange={handleChange}
                                    placeholder="Pickup Time"
                                    className="rounded border p-2"
                                    required
                                    disabled={['finished', 'canceled'].includes(selectedOrder?.status as string)}
                                />
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Additional Notes"
                                    className="rounded border p-2"
                                    disabled={['finished', 'canceled'].includes(selectedOrder?.status as string)}
                                />
                                {selectedOrder?.status === 'return_now' && (
                                    <textarea
                                        name="return_information"
                                        value={form.return_information}
                                        onChange={handleChange}
                                        placeholder="Return Information (e.g. Was the phone returned late? Was the condition bad? Write any summary here.)"
                                        className="rounded border p-2"
                                        rows={3}
                                    />
                                )}
                                {error && <div className="text-sm text-red-500">{error}</div>}
                            </div>
                        )}
                        <DialogFooter>
                            {selectedOrder?.status !== 'finished' && (
                                <button
                                    onClick={() => confirmAction('cancel', handleCancel)}
                                    className="flex cursor-pointer items-center justify-center rounded bg-red-500 px-4 py-2 text-white"
                                    disabled={processing && showConfirm.action === 'cancel'}
                                >
                                    {processing && showConfirm.action === 'cancel' ? <span className="loader mr-2"></span> : null}
                                    Cancel Order
                                </button>
                            )}
                            {selectedOrder?.status === 'waiting' && (
                                <button
                                    onClick={() => confirmAction('confirm', handleConfirmOrder)}
                                    className="flex cursor-pointer items-center justify-center rounded bg-blue-600 px-4 py-2 text-white"
                                    disabled={processing && showConfirm.action === 'confirm'}
                                >
                                    {processing && showConfirm.action === 'confirm' ? <span className="loader mr-2"></span> : null}
                                    Confirm
                                </button>
                            )}
                            {selectedOrder?.status !== 'finished' && selectedOrder?.status !== 'waiting' && (
                                <button
                                    onClick={() => confirmAction('edit', handleSaveChanges)}
                                    className="flex cursor-pointer items-center justify-center rounded bg-blue-600 px-4 py-2 text-white"
                                    disabled={processing && showConfirm.action === 'edit'}
                                >
                                    {processing && showConfirm.action === 'edit' ? <span className="loader mr-2"></span> : null}
                                    Save Changes
                                </button>
                            )}
                            {selectedOrder?.status === 'ready' && (
                                <button
                                    onClick={() => confirmAction('pickedup', handlePickedUp)}
                                    className="flex cursor-pointer items-center justify-center rounded bg-green-600 px-4 py-2 text-white"
                                    disabled={processing && showConfirm.action === 'pickedup'}
                                >
                                    {processing && showConfirm.action === 'pickedup' ? <span className="loader mr-2"></span> : null}
                                    Customer Picked Up
                                </button>
                            )}
                            {selectedOrder?.status === 'return_now' && (
                                <button
                                    onClick={() => confirmAction('finish', handleFinishOrder)}
                                    className="flex cursor-pointer items-center justify-center rounded bg-purple-600 px-4 py-2 text-white"
                                    disabled={processing && showConfirm.action === 'finish'}
                                >
                                    {processing && showConfirm.action === 'finish' ? <span className="loader mr-2"></span> : null}
                                    Finish Order
                                </button>
                            )}
                            {selectedOrder?.status === 'finished' && (
                                <button onClick={handleClose} className="rounded bg-blue-600 px-4 py-2 text-white">
                                    Close
                                </button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* Confirmation Dialog */}
                {showConfirm.action && (
                    <ConfirmDialog open={true} onOpenChange={() => setShowConfirm({ action: null, onConfirm: null })}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Action</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                {showConfirm.action === 'confirm' && 'Are you sure you want to confirm this order?'}
                                {showConfirm.action === 'edit' && 'Are you sure you want to edit this order info?'}
                                {showConfirm.action === 'cancel' && 'Are you sure you want to cancel this order?'}
                                {showConfirm.action === 'pickedup' && 'Are you sure the customer has picked up the product?'}
                                {showConfirm.action === 'finish' && 'Are you sure you want to finish this order?'}
                            </div>
                            <DialogFooter>
                                <button
                                    onClick={() => setShowConfirm({ action: null, onConfirm: null })}
                                    className="rounded bg-red-500 px-4 py-2 text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={showConfirm.onConfirm!}
                                    className="flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white"
                                >
                                    {processing ? <span className="loader mr-2"></span> : null}Yes
                                </button>
                            </DialogFooter>
                        </DialogContent>
                    </ConfirmDialog>
                )}
            </div>
        </AppLayout>
    );
}
