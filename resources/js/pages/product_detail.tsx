interface Product {
  name: string;
  description: string;
  type: string;
  price_per_day?: number;
  image: string;

  // Add more fields as needed
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Type : {product.type}</p>
      <p>Price : Rp{product.price_per_day}</p>
      <img src={`/images/products/${product.image}`} alt={product.name} style={{ width: 200, height: 'auto' }}/>
      {/* Add more product info here */}
    </div>
  );
}