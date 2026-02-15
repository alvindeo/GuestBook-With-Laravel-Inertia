import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const StatCard = ({ title, value, subtitle, icon, colorClass = "bg-white", textColor = "text-gray-900" }) => (
    <div className={`overflow-hidden ${colorClass} shadow-sm rounded-2xl p-6 flex flex-col justify-between h-32 border border-gray-100`}>
        <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg bg-opacity-20 flex items-center justify-center`}>
                {icon}
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        </div>
        <div>
            <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
            <div className={`text-xs ${textColor} opacity-60 mt-1`}>{subtitle}</div>
        </div>
    </div>
);

export default function HistoryUser({ visitor, visits, stats }) {
    return (
        <AuthenticatedLayout

            // header
            header={
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Link 
                            href={route('laporan')}
                            className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                History Kunjungan: <span className="text-red-600">{visitor.name}</span>
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Lacak seluruh aktivitas kunjungan tamu di gedung Telkom</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`History - ${visitor.name}`} />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Visitor Profile Section */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-3xl border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-50/50 via-transparent to-transparent">
                        {/* <div className="w-24 h-24 rounded-3xl bg-red-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-red-200 rotate-3">
                            {visitor.name?.charAt(0).toUpperCase()}
                        </div> */}
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* nama */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">{visitor.name}</p>
                                </div>

                                {/* email */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Email</label>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">{visitor.email}</p>
                                </div>

                                {/* no whatsapp */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. Whatsapp</label>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">{visitor.phone}</p>
                                </div>

                                {/* asal instansi */}
                                <div className="md:col-span-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asal Instansi</label>
                                    <p className="text-lg font-bold text-red-600 mt-0.5">{visitor.institution || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* total kunjungan */}
                        <StatCard 
                            title="Total Kunjungan" 
                            value={stats.total_visits} 
                            subtitle="Kali datang ke gedung" 
                            icon={<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        />

                        {/* total durasi */}
                        <StatCard 
                            title="Total Durasi" 
                            value={`${stats.total_duration}'`} 
                            subtitle="Menit total di dalam" 
                            icon={<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />

                        {/* kunjungan terakhir */}
                        <StatCard 
                            title="Kunjungan Terakhir" 
                            value={stats.last_visit ? new Date(stats.last_visit).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-'} 
                            subtitle={stats.last_visit ? new Date(stats.last_visit).getFullYear() : 'Belum ada data'} 
                            icon={<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        />
                    </div>

                    {/* Table Section */}
                    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-3xl">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Riwayat Aktivitas</h3>
                            <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-tighter">Diurutkan berdasarkan yang terbaru</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">

                                    {/* header table */}
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tujuan Keperluan</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Check In</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Check Out</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Durasi</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-50">
                                    {visits.map((visit, index) => (
                                        <tr key={visit.id} className="hover:bg-gray-50/50 transition-colors">

                                            {/* no */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{index + 1}</td>
                                            
                                            {/* tujuan keperluan */}
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900 uppercase">{visit.purpose}</div>
                                                <div className="text-[10px] text-gray-400 font-medium mt-0.5">ID Kunjungan: {visit.id}</div>
                                            </td>

                                            {/* check in */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">
                                                    {new Date(visit.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-[10px] text-gray-400">Pukul {new Date(visit.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                                            </td>

                                            {/* check out */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {visit.check_out_at ? (
                                                    <>
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {new Date(visit.check_out_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400">Pukul {new Date(visit.check_out_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                                                    </>
                                                ) : '-'}
                                            </td>

                                            {/* durasi */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-gray-700">{visit.duration_minutes ? `${visit.duration_minutes}m` : '-'}</span>
                                            </td>

                                            {/* status */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {visit.status === 'in' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm shadow-green-100">
                                                        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                                                        DI DALAM
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                                        SELESAI
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {visits.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center">
                                                <p className="text-gray-400 text-sm italic">Belum ada riwayat kunjungan.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
