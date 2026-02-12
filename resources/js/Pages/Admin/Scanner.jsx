import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard() {
    useEffect(() => {
        window.Echo.channel('new-guest')
            .listen('GuestCheckedIn', (e) => {
                console.log('Tamu baru datang:', e.guest);
                // Di sini kamu update state data tamu atau munculkan toast
            });
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Scanner" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
