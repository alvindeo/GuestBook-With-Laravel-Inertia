import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useEchoMultiple } from '@/hooks/useEcho';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Pendaftar({ pendingVisits, flash }) {
    const [visits, setVisits] = useState(pendingVisits);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});
    const [processing, setProcessing] = useState(false);

    // Setup realtime listeners
    useEchoMultiple('dashboard', {
        'visitor.registered': (data) => {
            console.log('✅ Visitor baru terdaftar:', data.visitor);
            // Refresh data
            router.reload({ only: ['pendingVisits'] });
        },
        'visitor.checked-in': (data) => {
            console.log('✅ Visitor check-in:', data.visit);
            // Refresh data (visitor akan hilang dari list pending)
            router.reload({ only: ['pendingVisits'] });
        },
        'visitor.cancelled': (data) => {
            console.log('🚫 Visitor Cancelled:', data.visit);
            // Refresh data (visitor akan hilang dari list pending)
            router.reload({ only: ['pendingVisits'] });
        },
    });

    // Update local state when props change
    useEffect(() => {
        setVisits(pendingVisits);
    }, [pendingVisits]);

    // Handle action functions
    const handleCheckIn = (visit) => {
        setModalConfig({
            title: 'Manual Check-in',
            message: (
                <div>
                    <p className="mb-2">Are you sure you want to check-in this visitor?</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-left text-sm">
                        <p><strong>Name:</strong> {visit.visitor_name}</p>
                        <p><strong>Institution:</strong> {visit.institution}</p>
                        <p><strong>Purpose:</strong> {visit.purpose}</p>
                    </div>
                </div>
            ),
            type: 'success',
            confirmText: 'Yes, Check-in',
            onConfirm: () => {
                setProcessing(true);
                router.post(route('admin.visits.check-in', visit.id), {}, {
                    onFinish: () => {
                        setProcessing(false);
                        setShowModal(false);
                    }
                });
            }
        });
        setShowModal(true);
    };

    const handleCancel = (visit) => {
        setModalConfig({
            title: 'Cancel Visitor',
            message: (
                <div>
                    <p className="mb-2">Are you sure you want to cancel this visitor registration?</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-left text-sm">
                        <p><strong>Name:</strong> {visit.visitor_name}</p>
                        <p><strong>Institution:</strong> {visit.institution}</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Cancelled visitors will still appear in reports.</p>
                </div>
            ),
            type: 'danger',
            confirmText: 'Yes, Cancel',
            onConfirm: () => {
                setProcessing(true);
                router.post(route('admin.visits.cancel', visit.id), {}, {
                    onFinish: () => {
                        setProcessing(false);
                        setShowModal(false);
                    }
                });
            }
        });
        setShowModal(true);
    };

    // Filter berdasarkan search
    const filteredVisits = visits.filter(visit => 
        visit.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.phone.includes(searchTerm) ||
        visit.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-50 p-3 rounded-2xl">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Daftar Pendaftar
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Visitor yang sudah mendaftar tapi belum check-in</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                            <span className="text-sm font-semibold text-yellow-700">
                                {visits.length} Pendaftar
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Pendaftar" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                        {/* Search Bar */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama, instansi, telepon, atau tujuan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            {filteredVisits.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Instansi</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tujuan</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu Daftar</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {filteredVisits.map((visit, index) => (
                                            <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                    {index + 1}
                                                </td>

                                                {/* Nama */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        {/* <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold shrink-0">
                                                            {visit.visitor_name.charAt(0).toUpperCase()}
                                                        </div> */}
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{visit.visitor_name}</div>
                                                            
                                                            {visit.is_urgent ? (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Urgent
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Instansi */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                    {visit.institution}
                                                </td>

                                                {/* Kontak */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            {visit.phone}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            {visit.email}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Tujuan */}
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {visit.purpose}
                                                    </div>
                                                </td>

                                                {/* Waktu Daftar */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(visit.registered_at).toLocaleString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                                        Pending
                                                    </span>
                                                </td>

                                                {/* Aksi */}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleCheckIn(visit)}
                                                            className="w-full inline-flex items-center justify-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                                                        >
                                                            Check-in
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(visit)}
                                                            className="w-full inline-flex items-center justify-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                                                        >
                                                            Cancelled
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-16">
                                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="mt-4 text-gray-500 text-sm font-medium">
                                        {searchTerm ? 'Tidak ada hasil yang cocok dengan pencarian' : 'Belum ada pendaftar yang menunggu check-in'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={showModal}
                onClose={() => !processing && setShowModal(false)}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
