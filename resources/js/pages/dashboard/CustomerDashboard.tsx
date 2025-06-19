import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Dashboard',
        href: '/dashboard',
    },
];

// Update Product type for image and rent_price
interface Product {
    id: number;
    name: string;
    rent_price: number;
    image: string;
}

interface DashboardProps {
    products: Product[];
}

export default function CustomerDashboard({ products }: DashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={route('products.show', product.id)}
                            className="group block border border-sidebar-border/70 dark:border-sidebar-border rounded-xl overflow-hidden bg-card shadow hover:shadow-lg transition cursor-pointer h-full"
                        >
                            <div className="aspect-video bg-muted flex items-center justify-center">
                                <img
                                    src={product.image ? `/storage/${product.image}` : '/images/products/default.png'}
                                    alt={product.name}
                                    className="object-contain w-full h-full max-h-40 group-hover:scale-105 transition"
                                />
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <h2 className="font-bold text-lg text-foreground truncate">{product.name}</h2>
                                <div className="text-primary font-semibold text-base">Rp{product.rent_price?.toLocaleString()}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No results message */}
                {filteredProducts.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No products found matching your search.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
