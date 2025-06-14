import { useState } from "react";
import { Link } from "@inertiajs/react";

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
    // Hardcoded for demo
    const [selectedSwitch, setSelectedSwitch] = useState("RED SWITCH");
    const [quantity, setQuantity] = useState(1);
    const maxQuantity = Math.min(product.stock, 99);
    const discount = 11; // 11% off, hardcoded
    const originalPrice = product.rent_price / (1 - discount / 100);
    const thumbnails = [product.image, product.image, product.image, product.image]; // Placeholder
    const [selectedImage, setSelectedImage] = useState(product.image);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/20 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 flex flex-col md:flex-row gap-8 p-8">
                {/* Product Images */}
                <div className="flex flex-col items-center w-full md:w-1/2 gap-4">
                    <div className="w-full aspect-square bg-gradient-to-br from-muted to-background rounded-xl flex items-center justify-center overflow-hidden relative">
                        <img
                            src={selectedImage ? `/storage/${selectedImage}` : "/images/products/default.png"}
                            alt={product.name}
                            className="object-contain w-full h-full max-h-[400px] max-w-[400px]"
                        />
                        <button className="absolute top-4 right-4 bg-background/80 rounded-full p-2 shadow hover:bg-muted transition"><svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="9" strokeWidth="2"/><path d="M10 10m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" strokeWidth="2"/></svg></button>
                    </div>
                    <div className="flex gap-3 w-full justify-center">
                        {thumbnails.map((img, idx) => (
                            <button
                                key={idx}
                                className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center overflow-hidden ${selectedImage === img ? "border-primary" : "border-transparent"}`}
                                onClick={() => setSelectedImage(img)}
                                type="button"
                            >
                                <img
                                    src={img ? `/storage/${img}` : "/images/products/default.png"}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="object-contain w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                </div>
                {/* Product Info */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-xs text-white font-bold px-2 py-1 rounded">PREMIUM</span>
                        <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
                            {"★".repeat(5)}
                            <span className="text-xs text-muted-foreground ml-1">(1,286)</span>
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
                    <div className="text-muted-foreground flex gap-4 text-sm">
                        <span>Color: <span className="text-foreground font-semibold">{product.color}</span></span>
                        <span>Storage: <span className="text-foreground font-semibold">{product.storage}</span></span>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-primary">${product.rent_price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        <span className="line-through text-muted-foreground text-lg">${originalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded">-{discount}%</span>
                    </div>
                    <div className="flex gap-4 my-2">
                        <div className="flex flex-col items-center px-4 py-2 bg-muted/40 rounded-lg">
                            <span className="font-bold text-primary">75% Layout</span>
                            <span className="text-xs text-muted-foreground">Compact Design</span>
                        </div>
                        <div className="flex flex-col items-center px-4 py-2 bg-muted/40 rounded-lg">
                            <span className="font-bold text-primary">Hot-Swap</span>
                            <span className="text-xs text-muted-foreground">Switch Ready</span>
                        </div>
                        <div className="flex flex-col items-center px-4 py-2 bg-muted/40 rounded-lg">
                            <span className="font-bold text-primary">RGB Backlit</span>
                            <span className="text-xs text-muted-foreground">Customizable</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold">Switch Type</span>
                        <div className="flex gap-3 mt-2">
                            {["RED SWITCH", "BLUE SWITCH", "BROWN SWITCH"].map((sw) => (
                                <button
                                    key={sw}
                                    className={`px-4 py-2 rounded border font-semibold transition ${selectedSwitch === sw ? "bg-primary text-white border-primary" : "bg-background border-muted text-foreground hover:bg-muted/30"}`}
                                    onClick={() => setSelectedSwitch(sw)}
                                    type="button"
                                >
                                    {sw}
                                </button>
                            ))}
                        </div>
                    </div>
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
                        <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" stroke="currentColor"><path d="M2 6h14M2 12h14" strokeWidth="2"/></svg> Secure Payment</span>
                        <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" stroke="currentColor"><path d="M3 8l4.5 4.5L21 3" strokeWidth="2"/></svg> Fast Delivery</span>
                        <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" stroke="currentColor"><circle cx="9" cy="9" r="7" strokeWidth="2"/><path d="M9 5v4l3 3" strokeWidth="2"/></svg> Top Rated</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
