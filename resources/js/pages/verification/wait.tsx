import { Head } from '@inertiajs/react';

export default function VerificationWait() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <Head title="Waiting for Verification" />
            <div className="rounded bg-white p-8 text-center shadow-md">
                <h1 className="mb-4 text-2xl text-gray-500 font-bold">Account Pending Verification</h1>
                <p className="text-sm text-gray-500 mb-4">Thank you for registering! Your account is currently awaiting admin verification.</p>
                <p className="text-sm text-gray-500 mb-4">You will be notified by email once your account has been verified and you can access the full website.</p>
                <p className="text-sm text-gray-500">If you have questions, please contact support.</p>
            </div>
        </div>
    );
}
