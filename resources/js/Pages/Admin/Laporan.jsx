import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Laporan({ visits }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        window.Echo.channel('new-guest')
            .listen('GuestCheckedIn', (e) => {
                console.log('Tamu baru datang:', e.guest);
            });
    }, []);

    // Logic Filtering nama/instansi/tujuan dan tanggal
    const filteredVisits = visits.filter(visit => {
        const matchesSearch = 
            visit.visitor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.visitor?.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDate = !dateFilter || 
            new Date(visit.created_at).toISOString().split('T')[0] === dateFilter;

        return matchesSearch && matchesDate;
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Laporan Kunjungan
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Riwayat lengkap data pengunjung Telkom</p>
                    </div>
                    <Link
                        href={route('laporan.export')}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-all active:scale-95"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                    </Link>
                </div>
            }
        >
            <Head title="Laporan Kunjungan" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filter & Search Section */}
                    <div className="bg-white p-6 rounded-t-2xl border-x border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama, instansi, atau tujuan..." 
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input 
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all w-full"
                            />
                            { (searchTerm || dateFilter) && (
                                <button 
                                    onClick={() => {setSearchTerm(''); setDateFilter('');}}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-xl shrink-0"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Isi Table */}
                    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-b-2xl">
                        <div className="text-gray-900">
                            {filteredVisits && filteredVisits.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            
                                            <tr className="bg-gray-50/50">
                                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">No</th>
                                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pengunjung</th>
                                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tujuan</th>
                                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Waktu</th>
                                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Durasi</th>
                                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {filteredVisits.map((visit, index) => (
                                                <tr key={visit.id} className="hover:bg-gray-50/50 transition-colors">

                                                    {/* No */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                        {index + 1}
                                                    </td>

                                                    {/* Pengunjung */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            {/* <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs">
                                                                {visit.visitor?.name?.charAt(0)}
                                                            </div> */}

                                                            <div>
                                                                {/* Nama */}
                                                                <div className="text-sm font-bold text-gray-900 uppercase">
                                                                    {visit.visitor?.name}
                                                                </div>

                                                                {/* Instansi */}
                                                                <div className="text-[10px] text-gray-400 font-medium uppercase">
                                                                    {visit.visitor?.institution}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Tujuan */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {visit.purpose}
                                                    </td>

                                                    {/* Waktu */}
                                                    <td className="px-6 py-4 whitespace-nowrap">

                                                        {/* Tanggal */}
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {new Date(visit.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>

                                                        {/* Jam */}
                                                        <div className="text-[10px] text-gray-400">
                                                            Pukul {new Date(visit.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                        </div>
                                                    </td>

                                                    {/* Durasi Kunjungan */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {visit.duration_minutes ? `${visit.duration_minutes}m` : '-'}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {visit.status === 'in' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                                                <span className="w-1 h-1 rounded-full bg-green-600 animate-pulse"></span>
                                                                DI DALAM
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                                                KELUAR
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-sm italic font-medium">Tidak ada data yang cocok dengan pencarian Anda.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}
