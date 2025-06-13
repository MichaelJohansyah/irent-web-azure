import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Partner Dashboard',
        href: '/dashboard',
    },
];

export default function PartnerDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partner Dashboard" />
            {/* No product list or top action buttons for partner, all actions are now in sidebar */}
        </AppLayout>
    );
}
