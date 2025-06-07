import { InertiaLink } from '@inertiajs/inertia-react';

{products.map(product => (
  <div key={product.id}>
    <h2>{product.name}</h2>
    <InertiaLink href={route('products.show', product.id)}>
      <button>View Details</button>
    </InertiaLink>
  </div>
))}