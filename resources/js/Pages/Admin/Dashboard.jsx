import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import MyChart from '@/Components/Chart';
import InstitutionChart from '@/Components/InstitutionChart';
import { useEchoMultiple } from '@/hooks/useEcho';
import ConfirmationModal from '@/Components/ConfirmationModal';


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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [realtimeStats, setRealtimeStats] = useState(stats);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // State untuk manual check-out
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});
    const [processing, setProcessing] = useState(false);

    // Function untuk refresh data dari server
    const refreshData = useCallback(() => {
        router.reload({ only: ['stats', 'chartData', 'instansiData'] });
    }, []);

    // Function untuk show notification
    const showToast = useCallback((message) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
    }, []);

    // Setup realtime listeners
    useEchoMultiple('dashboard', {
        'visitor.registered': (data) => {
            console.log('✅ Visitor baru terdaftar:', data.visitor);
            showToast(`🎉 Visitor baru: ${data.visitor.name} dari ${data.visitor.institution}`);
            refreshData();
        },
        'visitor.checked-in': (data) => {
            console.log('✅ Visitor check-in:', data.visit);
            showToast(`👋 ${data.visit.visitor_name} telah check-in`);
            refreshData();
        },
        'visitor.checked-out': (data) => {
            console.log('✅ Visitor check-out:', data.visit);
            showToast(`👋 ${data.visit.visitor_name} telah check-out`);
            refreshData();
        },
    });

    useEffect(() => {
        // Update jam setiap detik
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Update local stats when props change
    useEffect(() => {
        setRealtimeStats(stats);
    }, [stats]);

    // Function for manual checkout
    const handleManualCheckOut = (visit) => {
        setModalConfig({
            title: 'Manual Check-out',
            message: (
                <div>
                    <p className="mb-2">Are you sure you want to check-out this visitor manually?</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-left text-sm">
                        <p><strong>Name:</strong> {visit.visitor?.name || visit.visitor_name}</p>
                        <p><strong>Institution:</strong> {visit.visitor?.institution || visit.institution}</p>
                        <p><strong>Check-in Time:</strong> {new Date(visit.check_in_at).toLocaleTimeString('id-ID')}</p>
                    </div>
                </div>
            ),
            type: 'primary',
            confirmText: 'Yes, Check-out',
            onConfirm: () => {
                setProcessing(true);
                router.post(route('admin.visits.check-out', visit.id), {}, {
                    onFinish: () => {
                        setProcessing(false);
                        setShowConfirmModal(false);
                    }
                });
            }
        });
        setShowConfirmModal(true);
    };

    const defaultStats = realtimeStats || { totalTamu: 0, retensi: 0, aktif: 0, rerata: 0 };

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

            // dashboard kunjungan header
            header={
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 p-3 rounded-2xl">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Visitor Dashboard
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Monitor your visitor statistics in real-time</p>
                        </div>
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
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1.5 flex items-center justify-end gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                Live Now
                            </div>
                        </div>
                    </div>
                </div>

            }
        >

            <Head title="Dashboard" />

            {/* Realtime Notification Toast */}
            {showNotification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-2xl p-4 max-w-md flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Update Real-time</p>
                            <p className="text-sm text-gray-600 mt-1">{notificationMessage}</p>
                        </div>
                        <button 
                            onClick={() => setShowNotification(false)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="py-12 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Total Visitors" 
                            value={defaultStats.totalTamu} 
                            subtitle="Guest Database" 
                            icon={<svg className="w-6 h-6 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        />

                        {/* Retensi */}
                        <StatCard 
                            title="Retention" 
                            value={defaultStats.retensi} 
                            subtitle="High Loyalty" 
                            colorClass="bg-red-800"
                            textColor="text-white"
                            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                        />

                        {/* Aktif */}
                        <StatCard 
                            title="Active Now" 
                            value={defaultStats.aktif} 
                            subtitle="Inside Building" 
                            colorClass="bg-red-950"
                            textColor="text-white"
                            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                        />

                        {/* Rerata */}
                        <StatCard 
                            title="Average Time" 
                            value={`${defaultStats.rerata}m`} 
                            subtitle="Minutes per guest" 
                            icon={<svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                    </div>

                    {/* Row 2: GRAFIK KUNJUNGAN */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chart kunjungan harian */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
                                Visit Trends This Week
                            </h3>
                            <div className="h-[350px]">
                                <MyChart dataPoints={chartData || []} />
                            </div>
                        </div>

                        {/* asal instansi */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col relative">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-orange-200 rounded-full"></div>
                                Asal Instansi (Top 10)
                            </h3>
                            <div className="h-[350px]">
                                <InstitutionChart dataPoints={instansiData || []} />
                            </div>

                            {/* Tombol Lihat Selengkapnya */}
                            {instansiData?.length > 10 && (
                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest flex items-center gap-1.5 group"
                                    >
                                        Lihat Selengkapnya
                                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Modal Seluruh Instansi */}
                            {isModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border border-gray-100">
                                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900">Seluruh Daftar Instansi</h4>
                                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Total {instansiData.length} Instansi Terdaftar</p>
                                            </div>
                                            <button 
                                                onClick={() => setIsModalOpen(false)}
                                                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-0">
                                            <table className="min-w-full divide-y divide-gray-100">
                                                <thead className="bg-gray-50/50 flex w-full">
                                                    <tr className="flex w-full">
                                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">No</th>
                                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-1">Nama Instansi</th>
                                                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">Jumlah</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-50 flex flex-col w-full overflow-y-auto max-h-[50vh]">
                                                    {instansiData.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors flex w-full">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium w-16">{index + 1}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold flex-1 uppercase">{item.label}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-bold text-right w-24">
                                                                <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs">
                                                                    {item.value}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                                            <button 
                                                onClick={() => setIsModalOpen(false)}
                                                className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                                            >
                                                Tutup
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 3: TAMU YANG SEDANG BERKUNJUNG */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
                            Guests Inside Building
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
                                                    Check in: {new Date(guest.check_in_at || guest.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
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

                                            {/* Action Button */}
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => handleManualCheckOut({
                                                        id: guest.id,
                                                        visitor_name: guest.visitor?.name,
                                                        institution: guest.visitor?.institution,
                                                        check_in_at: guest.created_at
                                                    })}
                                                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    CHECK-OUT MANUAL
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-400 text-sm italic">Tidak ada tamu yang sedang masuk.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <ConfirmationModal
                show={showConfirmModal}
                onClose={() => !processing && setShowConfirmModal(false)}
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



