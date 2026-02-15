import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function TambahUser({ flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        institution: '',
        purpose: '',
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [countdown, setCountdown] = useState(4);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessModal(true);
            reset();
            setCountdown(4);

            // Countdown timer
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        // Refresh halaman setelah countdown selesai
                        router.reload({ only: [] });
                        setShowSuccessModal(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [flash, reset]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tambah-user.store'));
    };

    // Auto-fill data jika nomor telepon sudah terdaftar
    const handlePhoneChange = async (e) => {
        const phone = e.target.value;
        setData('phone', phone);

        if (phone.length >= 10) {
            try {
                const response = await fetch(`/check-visitor/${phone}`);
                const visitor = await response.json();
                
                if (visitor) {
                    setData({
                        ...data,
                        phone: phone,
                        name: visitor.name || '',
                        email: visitor.email || '',
                        institution: visitor.institution || '',
                    });
                }
            } catch (error) {
                console.error('Error checking visitor:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-2xl">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Tambah Pengunjung
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Tambahkan pengunjung baru ke dalam sistem</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Pengunjung" />

            {/* Success Modal Popup */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-once">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Berhasil! 🎉
                            </h3>
                            <p className="text-gray-600">
                                Admin berhasil menambahkan pengunjung
                            </p>
                        </div>

                        {/* Countdown Timer */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                            <div className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-blue-800">
                                    Halaman akan refresh dalam <span className="font-bold text-lg">{countdown}</span> detik
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(4 - countdown) * 25}%` }}
                            />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.reload({ only: [] });
                            }}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg"
                        >
                            Tutup & Refresh Sekarang
                        </button>
                    </div>
                </div>
            )}

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {/* Form Card */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nomor Telepon */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                                        Nomor Telepon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="08123456789"
                                        required
                                    />
                                    {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                                    <p className="mt-1 text-xs text-gray-500">Data akan otomatis terisi jika nomor sudah terdaftar</p>
                                </div>

                                {/* Nama Lengkap */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Masukkan nama lengkap anda"
                                        required
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="nama@email.com"
                                        required
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                {/* Instansi */}
                                <div>
                                    <label htmlFor="institution" className="block text-sm font-bold text-gray-700 mb-2">
                                        Instansi/Perusahaan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="institution"
                                        value={data.institution}
                                        onChange={(e) => setData('institution', e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Nama instansi/perusahaan"
                                        required
                                    />
                                    {errors.institution && <p className="mt-2 text-sm text-red-600">{errors.institution}</p>}
                                </div>

                                {/* Tujuan Kunjungan */}
                                <div>
                                    <label htmlFor="purpose" className="block text-sm font-bold text-gray-700 mb-2">
                                        Tujuan Kunjungan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="purpose"
                                        value={data.purpose}
                                        onChange={(e) => setData('purpose', e.target.value)}
                                        rows="4"
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        placeholder="Jelaskan tujuan kunjungan Anda..."
                                        required
                                    />
                                    {errors.purpose && <p className="mt-2 text-sm text-red-600">{errors.purpose}</p>}
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Menyimpan...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                                Tambah Pengunjung
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-blue-900 mb-1">Informasi</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Pengunjung yang ditambahkan akan masuk ke daftar <strong>Pendaftar</strong> dengan status <strong>Pending</strong></li>
                                    <li>• Scan QR code untuk mengubah status menjadi <strong>Check-in</strong></li>
                                    <li>• Data akan otomatis terisi jika nomor telepon sudah terdaftar</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
