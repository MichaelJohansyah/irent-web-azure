import { useState } from "react";
import { Link } from "@inertiajs/react";
import { AppHeader } from '@/components/app-header';

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
    const discount = 11;
    const originalPrice = product.rent_price / (1 - discount / 100);

    return (
        <>
            <AppHeader />
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/20 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 flex flex-col md:flex-row gap-8 p-8">
                    {/* Product Image */}
                    <div className="flex flex-col items-center w-full md:w-1/2 gap-4">
                        <div className="w-full aspect-square bg-gradient-to-br from-muted to-background rounded-xl flex items-center justify-center overflow-hidden relative">
                            <img
                                src={product.image ? `/storage/${product.image}` : "/images/products/default.png"}
                                alt={product.name}
                                className="object-contain w-full h-full max-h-[400px] max-w-[400px]"
                            />
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
                                ${product.rent_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
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

                        <div className="flex flex-col gap-2 mt-4">
                            <button className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">Add to Cart</button>
                            <button className="w-full py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition">Add to Wishlist</button>
                        </div>
                        <div className="flex gap-8 mt-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" stroke="currentColor"><path d="M2 6h14M2 12h14" strokeWidth="2" /></svg> Secure Payment</span>
                            <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" stroke="currentColor"><path d="M3 8l4.5 4.5L21 3" strokeWidth="2" /></svg> Fast Delivery</span>
                            <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" strokeWidth="2" /><path d="M9 5v4l3 3" strokeWidth="2" /></svg> Top Rated</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
