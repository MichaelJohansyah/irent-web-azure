import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    ktp_photo: string;
    is_verified: boolean;
    role: string;
}

interface AdminUsersProps {
    users: User[];
}

export default function AdminUsers({ users }: AdminUsersProps) {
    const handleVerify = (userId: number) => {
        if (confirm('Verify this user?')) {
            router.post(`/admin/users/${userId}/verify`);
        }
    };
    const handleDelete = (userId: number) => {
        if (confirm('Delete this user?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Manage Users', href: '/admin/users' }]}>
            {' '}
            {/* Changed breadcrumb */}
            <div className="p-8">
                <Head title="Manage Users" />
                <h1 className="mb-4 text-2xl font-bold">Manage Users</h1>
                <table className="w-full border text-left">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold">Name</th>
                            <th className="px-3 py-2 text-left font-semibold">Role</th>
                            <th className="px-3 py-2 text-left font-semibold">Email</th>
                            <th className="px-3 py-2 text-left font-semibold">Phone</th>
                            <th className="px-3 py-2 text-left font-semibold">Address</th>
                            <th className="px-3 py-2 text-left font-semibold">KTP Photo</th>
                            <th className="px-3 py-2 text-left font-semibold">Action</th>
                            <th className="px-3 py-2 text-left font-semibold">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td>{user.name}</td>
                                <td>{user.role}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>
                                    <a
                                        href={user.ktp_photo ? `/storage/ktp_photos/${user.ktp_photo.split('/').pop()}` : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View
                                    </a>
                                </td>
                                <td>
                                    {user.is_verified ? (
                                        <span className="font-semibold text-green-600">Verified</span>
                                    ) : (
                                        <button className="rounded bg-green-600 px-3 py-1 text-white" onClick={() => handleVerify(user.id)}>
                                            Verify
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {(user.role === 'partner' || user.role === 'customer') && (
                                        <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => handleDelete(user.id)}>
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
