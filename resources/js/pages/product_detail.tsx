import { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
import { BreadcrumbItem } from "@/types";

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
            <div className="w-full h-full p-4">
                <div className="w-full bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 flex flex-col md:flex-row gap-8 p-4 md:p-8">
                    {/* Product Image Section */}
                    <div className="flex flex-col items-center w-full md:w-1/2 gap-4">
                        {/* Main Image */}
                        <div className="w-full aspect-square max-w-[400px] max-h-[400px] bg-gradient-to-br from-muted to-background rounded-xl flex items-center justify-center overflow-hidden relative">
                            <img
                                src={product.image ? `/storage/${product.image}` : "/images/products/default.png"}
                                alt={product.name}
                                className="object-cover w-full h-full"
                                style={{ display: 'block' }}
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col gap-6">
                        <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-primary">
                                Rp{product.rent_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-muted-foreground">/ day</span>
                        </div>
                        <div className="text-muted-foreground flex gap-4 text-sm">
                            <span>Color: <span className="text-foreground font-semibold">{product.color}</span></span>
                            <span>Storage: <span className="text-foreground font-semibold">{product.storage}</span></span>
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
                        <div className="flex items-center gap-4 mt-2">
                            <span className="font-semibold">Duration (Days)</span>
                            <div className="flex items-center border rounded overflow-hidden bg-muted/30">
                                <button
                                    type="button"
                                    className="px-3 py-1 text-lg font-bold text-primary disabled:opacity-40"
                                    onClick={() => setDuration(d => Math.max(1, d - 1))}
                                    disabled={duration <= 1}
                                >-</button>
                                <span className="px-4 py-1 min-w-[2rem] text-center">{duration}</span>
                                <button
                                    type="button"
                                    className="px-3 py-1 text-lg font-bold text-primary disabled:opacity-40"
                                    onClick={() => setDuration(d => Math.min(maxDuration, d + 1))}
                                    disabled={duration >= maxDuration}
                                >+</button>
                            </div>
                            <span className="text-xs text-muted-foreground">Max: {maxDuration} days</span>
                        </div>

                        <div className="flex flex-col text-sm">
                            <div className="flex justify-between items-center py-2 border-t">
                                <span className="text-muted-foreground">Default price</span>
                                <span className="font-semibold">Rp{product.rent_price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-b">
                                <span className="text-muted-foreground">Total price ({duration} days)</span>
                                <span className="font-bold text-lg">Rp{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 mt-4">
                            <Link
                                href={route('products.confirm', product.id)}
                                className="flex-1 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                            >
                                Order
                            </Link>
                            <button className="px-6 py-3 bg-muted/30 hover:bg-muted/50 text-foreground rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
