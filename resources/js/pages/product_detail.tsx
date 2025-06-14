import { useState } from "react";
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
    partner?: { name: string };
}

interface ProductDetailProps {
    product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const maxQuantity = Math.min(product.stock, 99);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: product.name, href: `/products/${product.id}` },
    ];

    // Thumbnail images (contoh sementara menggunakan gambar yang sama)
    const thumbnails = [
        product.image ? `/storage/${product.image}` : "/images/products/default.png",
        product.image ? `/storage/${product.image}` : "/images/products/default.png",
        product.image ? `/storage/${product.image}` : "/images/products/default.png"
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="flex justify-center items-center w-full h-[calc(100vh-4rem)] p-4">
                <div className="w-full max-w-4xl bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 flex flex-col md:flex-row gap-8 p-8">
                    {/* Product Image Section */}
                    <div className="flex flex-col items-center w-full md:w-1/2 gap-4">
                        {/* Main Image */}
                        <div className="w-full aspect-square bg-gradient-to-br from-muted to-background rounded-xl flex items-center justify-center overflow-hidden relative">
                            <img
                                src={product.image ? `/storage/${product.image}` : "/images/products/default.png"}
                                alt={product.name}
                                className="object-contain w-full h-full max-h-[400px] max-w-[400px]"
                            />
                        </div>
                        {/* Thumbnail Row */}
                        <div className="flex justify-center gap-2 w-full">
                            {thumbnails.map((thumb, index) => (
                                <div 
                                    key={index}
                                    className="w-24 h-24 bg-gradient-to-br from-muted to-background rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-border/50"
                                >
                                    <img
                                        src={thumb}
                                        alt={`${product.name} thumbnail ${index + 1}`}
                                        className="object-contain w-full h-full p-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col gap-6">
                        <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
                        <div className="text-muted-foreground flex gap-4 text-sm">
                            <span>Color: <span className="text-foreground font-semibold">{product.color}</span></span>
                            <span>Storage: <span className="text-foreground font-semibold">{product.storage}</span></span>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-primary">
                                Rp{product.rent_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-muted-foreground">/ day</span>
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

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="font-semibold">Quantity</span>
                            <div className="flex items-center border rounded overflow-hidden bg-muted/30">
                                <button
                                    type="button"
                                    className="px-3 py-1 text-lg font-bold text-primary disabled:opacity-40"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >-</button>
                                <span className="px-4 py-1 min-w-[2rem] text-center">{quantity}</span>
                                <button
                                    type="button"
                                    className="px-3 py-1 text-lg font-bold text-primary disabled:opacity-40"
                                    onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
                                    disabled={quantity >= maxQuantity}
                                >+</button>
                            </div>
                            <span className="text-xs text-muted-foreground">Max: {maxQuantity} pieces</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 mt-4">
                            <button className="flex-1 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                                Order
                            </button>
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
