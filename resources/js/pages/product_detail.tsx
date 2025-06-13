interface Product {
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
    return (
        <div className="flex flex-col gap-8 p-8 md:flex-row">
            {/* Product Image */}
            <div className="flex w-full flex-shrink-0 items-center justify-center md:w-1/3">
                <img
                    src={product.image ? `/storage/${product.image}` : '/images/products/default.png'}
                    alt={product.name}
                    className="bg-muted max-h-96 max-w-full rounded-lg object-contain shadow"
                />
            </div>
            {/* Product Info */}
            <div className="flex flex-1 flex-col gap-4">
                <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
                <div className="text-muted-foreground flex gap-4 text-sm">
                    <span>
                        Color: <span className="text-foreground font-semibold">{product.color}</span>
                    </span>
                    <span>
                        Storage: <span className="text-foreground font-semibold">{product.storage}</span>
                    </span>
                </div>
                <div className="text-primary text-lg font-semibold">
                    Rp{product.rent_price.toLocaleString()} <span className="text-sm font-normal">/ day</span>
                </div>
                <div className="text-sm">
                    Max Rent Duration: <span className="font-semibold">{product.max_rent_day} days</span>
                </div>
                <div className="text-sm">
                    Stock: <span className="font-semibold">{product.stock}</span>
                </div>
                <div className="text-sm">
                    Partner: <span className="font-semibold">{product.partner?.name || '-'}</span>
                </div>
                <div>
                    <div className="mb-1 font-semibold">Description</div>
                    <div className="bg-muted text-foreground max-h-40 overflow-y-auto rounded p-3 whitespace-pre-line">{product.description}</div>
                </div>
            </div>
        </div>
    );
}
