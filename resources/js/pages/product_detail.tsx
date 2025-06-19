import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
    partner?: {
        id: number;
        name: string;
    };
}

interface ProductDetailProps {
    product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [duration, setDuration] = useState(1);
    const maxDuration = product.max_rent_day;

    // Calculate total price based on duration with 10% increment for each additional day
    const totalPrice = useMemo(() => {
        // total = base price * (1 + 0.1 * (n-1))
        return product.rent_price * (1 + 0.1 * (duration - 1));
    }, [product.rent_price, duration]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: product.name, href: `/products/${product.id}` },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="h-full w-full p-4">
                <div className="bg-card/80 border-border/50 flex w-full flex-col gap-8 rounded-2xl border p-4 shadow-2xl backdrop-blur-sm md:flex-row md:p-8">
                    {/* Product Image Section */}
                    <div className="flex w-full flex-col items-center gap-4 md:w-1/2">
                        {/* Main Image */}
                        <div className="from-muted to-background relative flex aspect-square max-h-[400px] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br">
                            <img
                                src={product.image ? `/storage/${product.image}` : '/images/products/default.png'}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                style={{ display: 'block' }}
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col gap-6">
                        <h1 className="text-foreground text-3xl leading-tight font-bold">{product.name}</h1>
                        <div className="flex items-end gap-3">
                            <span className="text-primary text-3xl font-bold">
                                Rp{product.rent_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-muted-foreground">/ day</span>
                        </div>
                        <div className="text-muted-foreground flex gap-4 text-sm">
                            <span>
                                Color: <span className="text-foreground font-semibold">{product.color}</span>
                            </span>
                            <span>
                                Storage: <span className="text-foreground font-semibold">{product.storage}</span>
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex gap-2">
                                <span className="text-muted-foreground">Max Rent Duration:</span>
                                <span className="font-semibold">{product.max_rent_day} days</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-muted-foreground">Stock:</span>
                                <span className="font-semibold">{product.stock}</span>
                            </div>
                            {product.partner && (
                                <div className="flex gap-2">
                                    <span className="text-muted-foreground">Partner:</span>
                                    <span className="font-semibold">{product.partner.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="font-semibold">Description</span>
                            <p className="text-muted-foreground text-sm">{product.description}</p>
                        </div>

                        {/* Rent Duration */}
                        <div className="mt-2 flex items-center gap-4">
                            <span className="font-semibold">Duration (Days)</span>
                            <div className="bg-muted/30 flex items-center overflow-hidden rounded border">
                                <button
                                    type="button"
                                    className="text-primary px-3 py-1 text-lg font-bold disabled:opacity-40"
                                    onClick={() => setDuration((d) => Math.max(1, d - 1))}
                                    disabled={duration <= 1}
                                >
                                    -
                                </button>
                                <span className="min-w-[2rem] px-4 py-1 text-center">{duration}</span>
                                <button
                                    type="button"
                                    className="text-primary px-3 py-1 text-lg font-bold disabled:opacity-40"
                                    onClick={() => setDuration((d) => Math.min(maxDuration, d + 1))}
                                    disabled={duration >= maxDuration}
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-muted-foreground text-xs">Max: {maxDuration} days</span>
                        </div>

                        <div className="flex flex-col text-sm">
                            <div className="flex items-center justify-between border-t py-2">
                                <span className="text-muted-foreground">Default price</span>
                                <span className="font-semibold">Rp{product.rent_price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-b py-2">
                                <span className="text-muted-foreground">Total price ({duration} days)</span>
                                <span className="text-lg font-bold">
                                    Rp{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex gap-2">
                            {product.stock > 0 ? (
                                <Link
                                    href={route('products.confirm', {
                                        id: product.id,
                                        duration: duration,
                                        totalPrice: totalPrice,
                                    })}
                                    className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground flex-1 rounded-lg py-3 text-center text-lg font-bold shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r"
                                >
                                    Order
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="flex-1 rounded-lg bg-gray-400 py-3 text-center text-lg font-bold text-gray-100 opacity-60 cursor-not-allowed"
                                >
                                    Out of Stock
                                </button>
                            )}
                            <Link
                                href={`/chatify/${product.partner?.id}`}
                                className="text-foreground bg-muted/30 hover:bg-muted/50 flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
