import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Partner Dashboard',
        href: '/dashboard',
    },
];

interface Product {
    id: number;
    name: string;
    rent_price: number;
    image: string;
}

interface DashboardProps {
    products: Product[];
}

export default function PartnerDashboard({ products }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partner Dashboard" />
            <div className="p-8">
                {products.length === 0 ? (
                    <div className="text-muted-foreground mt-16 text-center text-lg">
                        You have not added any products yet.
                        <br />
                        Please add a product from the <span className="font-semibold">Add Product</span> page.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={route('products.edit', product.id)}
                                className="group border-sidebar-border/70 dark:border-sidebar-border bg-card block h-full cursor-pointer overflow-hidden rounded-xl border shadow transition hover:shadow-lg"
                            >
                                <div className="bg-muted flex aspect-video items-center justify-center">
                                    <img
                                        src={product.image ? `/storage/${product.image}` : '/images/products/default.png'}
                                        alt={product.name}
                                        className="h-full max-h-40 w-full object-contain transition group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 p-4">
                                    <h2 className="text-foreground truncate text-lg font-bold">{product.name}</h2>
                                    <div className="text-primary text-base font-semibold">Rp{product.rent_price?.toLocaleString()}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
