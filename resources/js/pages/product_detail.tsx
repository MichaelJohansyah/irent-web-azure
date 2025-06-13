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
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full md:w-1/3 flex items-center justify-center">
        <img
          src={product.image ? `/storage/${product.image}` : '/images/products/default.png'}
          alt={product.name}
          className="rounded-lg shadow max-w-full max-h-96 object-contain bg-muted"
        />
      </div>
      {/* Product Info */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Color: <span className="font-semibold text-foreground">{product.color}</span></span>
          <span>Storage: <span className="font-semibold text-foreground">{product.storage}</span></span>
        </div>
        <div className="text-lg font-semibold text-primary">Rp{product.rent_price.toLocaleString()} <span className="text-sm font-normal">/ day</span></div>
        <div className="text-sm">Max Rent Duration: <span className="font-semibold">{product.max_rent_day} days</span></div>
        <div className="text-sm">Stock: <span className="font-semibold">{product.stock}</span></div>
        <div className="text-sm">Partner: <span className="font-semibold">{product.partner?.name || '-'}</span></div>
        <div>
          <div className="font-semibold mb-1">Description</div>
          <div className="bg-muted rounded p-3 text-foreground whitespace-pre-line max-h-40 overflow-y-auto">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}