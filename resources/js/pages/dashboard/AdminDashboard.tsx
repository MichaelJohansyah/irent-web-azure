import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
];

// Define the Product type
interface Product {
    id: number;
    name: string;
    description: string;
    // Add other fields as needed
}

interface DashboardProps {
    products: Product[];
}

export default function AdminDashboard({ products }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            {/* Admin Users Button */}
            <div className="mb-4 flex justify-end">
                <a
                    href="admin/users"
                    target="_self"
                    rel="noopener noreferrer"
                    className="inline-block rounded bg-green-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-green-700"
                >
                    Manage Unverified Users
                </a>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border"
                        >
                            <div className="p-4">
                                <h2 className="font-bold">{product.name}</h2>
                                <p>{product.description}</p>
                                <Link
                                    href={route('products.show', product.id)}
                                    className="mt-2 inline-block rounded bg-blue-600 px-4 py-2 text-white"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
