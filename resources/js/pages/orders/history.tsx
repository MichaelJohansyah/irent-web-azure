import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Search } from 'lucide-react';

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
    pickup_address?: string;
    contact_number?: string;
    pickup_time?: string;
    notes?: string;
    return_information?: string; // add this field for summary
}

interface HistoryProps {
    orders: Order[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID'); // Indonesian format: dd/mm/yyyy
};

export default function History({ orders }: HistoryProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = orders.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        
        // Search in product name
        const matchesName = order.product?.name.toLowerCase().includes(searchLower);
        
        // Search in dates
        const startDate = formatDate(order.start_date);
        const endDate = formatDate(order.end_date);
        const matchesDate = startDate.includes(searchLower) || endDate.includes(searchLower);

        // Search in status
        const statusMap = {
            'waiting': 'waiting',
            'ready': 'ready',
            'rented': 'rented',
            'return': 'return_now',
            'finished': 'finished',
            'canceled': 'canceled'
        };
        const matchesStatus = Object.keys(statusMap).some(key => 
            key.includes(searchLower) && order.status === statusMap[key as keyof typeof statusMap]
        );

        return matchesName || matchesDate || matchesStatus;
    });

    const getStatusBadgeColor = (status: Order['status']) => {
        const colors = {
            waiting: 'bg-gray-800 text-white', // dark grey
            ready: 'bg-blue-600 text-white',   // blue
            rented: 'bg-green-600 text-white', // green
            return_now: 'bg-yellow-400 text-gray-900', // yellow
            finished: 'bg-white text-gray-900 border border-gray-300', // white
            canceled: 'bg-red-600 text-white', // red
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
                
                {/* Add the search bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by product name, date (dd/mm/yyyy), or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>

                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className={`bg-card text-foreground border-sidebar-border/70 flex flex-col items-center gap-4 rounded-xl border p-4 shadow md:flex-row ${order.status === 'ready' || order.status === 'return_now' || order.status === 'finished' ? 'hover:bg-muted/40 cursor-pointer' : ''}`}
                            onClick={() =>
                                order.status === 'ready' || order.status === 'return_now' || order.status === 'finished'
                                    ? setSelectedOrder(order)
                                    : undefined
                            }
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
                    {filteredOrders.length === 0 && (
                        <div className="py-8 text-center text-gray-500">
                            {searchTerm ? 'No orders found matching your search.' : 'No orders found.'}
                        </div>
                    )}
                </div>
                {/* Customer info modal (for customers) */}
                <Dialog
                    open={
                        !!selectedOrder &&
                        (selectedOrder.status === 'ready' || selectedOrder.status === 'return_now' || selectedOrder.status === 'finished')
                    }
                    onOpenChange={handleClose}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedOrder?.status === 'finished' ? 'Order Summary' : 'Pickup Information'}</DialogTitle>
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
                                {selectedOrder?.status === 'return_now' && (
                                    <div className="mt-4 rounded border border-yellow-300 bg-yellow-100 p-3 text-yellow-900">
                                        <div className="mb-1 font-bold">Your rent duration has ended. Please return the iPhone now.</div>
                                        <div>Please return the phone on time and in good condition because if it is not you will get charged.</div>
                                    </div>
                                )}
                            </div>
                        )}
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
