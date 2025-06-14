import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
    partner?: { id: number; name: string };
}

interface ConfirmProps {
    product: Product;
}

export default function Confirm(props: any) {
    const { product } = props;
    // Read duration and totalPrice from URL query params
    const [duration, setDuration] = useState(1);
    const [totalPrice, setTotalPrice] = useState(product.rent_price);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const d = Number(params.get('duration'));
        const t = Number(params.get('totalPrice'));
        if (!isNaN(d) && d > 0) setDuration(d);
        if (!isNaN(t) && t > 0) setTotalPrice(t);
    }, []);
    useEffect(() => {
        // Calculate end date based on start date and duration
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + duration - 1);
        setEndDate(end.toISOString().split('T')[0]);
    }, [startDate, duration]);
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        partner_id: product.partner?.id,
        duration: duration,
        start_date: startDate,
        total_price: totalPrice,
    });
    useEffect(() => {
        setData('duration', duration);
    }, [duration]);
    useEffect(() => {
        setData('start_date', startDate);
    }, [startDate]);
    useEffect(() => {
        setData('total_price', totalPrice);
    }, [totalPrice]);
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        setData('start_date', e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'), {
            onSuccess: () => {
                window.location.href = route('orders.index');
            },
        });
    };

    return (
        <AppSidebarLayout>
            <div className="flex h-full w-full items-center justify-center p-4">
                <div className="bg-card/80 border-border/50 flex w-full max-w-2xl flex-col gap-8 rounded-2xl border p-4 shadow-2xl backdrop-blur-sm md:p-8">
                    <h1 className="text-foreground mb-2 text-2xl font-bold">Konfirmasi Pesanan</h1>
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                        <div className="from-muted to-background flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br">
                            <img
                                src={product.image ? `/storage/${product.image}` : '/images/products/default.png'}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="text-foreground text-lg font-semibold">{product.name}</div>
                            <div className="text-muted-foreground text-sm">
                                Color: <span className="text-foreground font-semibold">{product.color}</span>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Storage: <span className="text-foreground font-semibold">{product.storage}</span>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="bg-muted/40 border-border/40 flex flex-col gap-2 rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total price ({duration} days)</span>
                                <span className="text-lg font-bold">
                                    Rp{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <div className="flex flex-col gap-1">
                                    <label className="text-foreground font-semibold">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        className="border-border bg-background text-foreground w-44 rounded-md border p-2"
                                    />
                                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-foreground font-semibold">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        readOnly
                                        className="border-border bg-background text-foreground w-44 rounded-md border p-2 opacity-60"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-3 text-lg font-bold shadow-lg transition-all duration-300"
                        >
                            {processing ? 'Processing...' : 'Konfirmasi Pesanan'}
                        </button>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
