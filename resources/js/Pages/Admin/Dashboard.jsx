import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MyChart from '@/Components/Chart';
import InstitutionChart from '@/Components/InstitutionChart';


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

export default function Dashboard({ stats, chartData, instansiData }) {
    // Jam start
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update jam setiap detik
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Echo listener
        window.Echo.channel('new-guest')
            .listen('GuestCheckedIn', (e) => {
                console.log('Tamu baru datang:', e.guest);
            });

        return () => clearInterval(timer);
    }, []);

    const defaultStats = stats || { totalTamu: 0, retensi: 0, aktif: 0, rerata: 0 };

    // Format WIB
    const timeString = currentTime.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    // Format tanggal
    const dateString = currentTime.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    // jam end

    return (
        <AuthenticatedLayout

            // dashboard kunjungan
            header={
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Dashboard Kunjungan
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Pantau statistik pengunjung Anda secara real-time</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-200/50">
                        {/* <div className="bg-red-500 p-2 rounded-xl">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div> */}
                        <div className="text-right">
                            <div className="text-xl font-bold text-gray-900 tabular-nums leading-none">
                                {timeString} <span className="text-xs font-medium text-red-600 ml-1">WIB</span>
                            </div>
                            <div className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-wider">
                                {dateString}
                            </div>
                        </div>
                    </div>
                </div>

            }
        >

            <Head title="Dashboard" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Row 1: KOTAK STATISTIK */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Total Tamu */}
                        <StatCard 
                            title="Total Tamu" 
                            value={defaultStats.totalTamu} 
                            subtitle="Basis Data Pengunjung" 
                            icon={<svg className="w-6 h-6 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        />

                        {/* Retensi */}
                        <StatCard 
                            title="Retensi" 
                            value={defaultStats.retensi} 
                            subtitle="Loyalitas Tinggi" 
                            colorClass="bg-red-800"
                            textColor="text-white"
                            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                        />

                        {/* Aktif */}
                        <StatCard 
                            title="Aktif" 
                            value={defaultStats.aktif} 
                            subtitle="Sedang Berkunjung" 
                            colorClass="bg-red-950"
                            textColor="text-white"
                            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                        />

                        {/* Rerata */}
                        <StatCard 
                            title="Rerata" 
                            value={`${defaultStats.rerata}'`} 
                            subtitle="Menit per tamu" 
                            icon={<svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                    </div>

                    {/* Row 2: GRAFIK KUNJUNGAN */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chart kunjungan harian */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
                                Tren Kunjungan Pekan Ini
                            </h3>
                            <div className="h-[350px]">
                                <MyChart dataPoints={chartData || []} />
                            </div>
                        </div>

                        {/* asal instansi */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-orange-200 rounded-full"></div>
                                Asal Instansi
                            </h3>
                            <div className="h-[350px]">
                                <InstitutionChart dataPoints={instansiData || []} />
                            </div>
                        </div>
                    </div>

                    {/* Row 3: TAMU YANG SEDANG BERKUNJUNG */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
                            Tamu di Dalam Gedung
                        </h3>
                        {defaultStats.activeGuests?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {defaultStats.activeGuests.map((guest, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 transition-hover hover:border-red-200">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold shrink-0">
                                            {guest.visitor?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-start">

                                                {/* Name */}
                                                <div className="font-bold text-gray-900 truncate text-sm">{guest.visitor?.name}</div>

                                                {/* Check in time */}
                                                <div className="text-xs text-gray-900 font-bold flex items-center gap-1.5 bg-green-100 px-2.5 py-1 rounded-full shrink-0 border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                                    Check in: {new Date(guest.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                            {/* Institution */}
                                            <div className="text-[11px] text-gray-500 font-medium truncate">{guest.visitor?.institution}</div>
                                            
                                            <div className="mt-2 space-y-1">

                                                {/* Email */}
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    {guest.visitor?.email}
                                                </div>

                                                {/* Phone */}
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                    {guest.visitor?.phone}
                                                </div>

                                                {/* Purpose */}
                                                <div className="inline-block mt-1 px-2 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600 font-semibold border border-gray-200">
                                                    Tujuan: {guest.purpose}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-400 text-sm italic">Saat ini tidak ada tamu di dalam gedung.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}



