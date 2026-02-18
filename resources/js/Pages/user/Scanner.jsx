import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

export default function Scanner() {
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('camera');
    
    const qrCodeRegionId = "reader";
    const html5QrCode = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const initScanner = async () => {
            if (activeTab === 'camera') {
                await startCamera();
            } else {
                await stopCamera();
            }
        };
        
        initScanner();

        return () => {
            stopCamera();
        };
    }, [activeTab]);

    const startCamera = async () => {
        try {
            if (!html5QrCode.current) {
                html5QrCode.current = new Html5Qrcode(qrCodeRegionId);
            }
            
            if (html5QrCode.current.isScanning) {
                await html5QrCode.current.stop();
            }

            setScanning(true);
            setError(null);
            
            const config = { 
                fps: 15, 
                qrbox: { width: 280, height: 280 },
                aspectRatio: 1.0
            };

            await html5QrCode.current.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                onScanFailure
            );
        } catch (err) {
            console.error("Error starting camera", err);
            setError("Kamera tidak dapat diakses. Silakan beri izin atau gunakan upload file.");
            setScanning(false);
        }
    };

    const stopCamera = async () => {
        if (html5QrCode.current && html5QrCode.current.isScanning) {
            try {
                await html5QrCode.current.stop();
                setScanning(false);
            } catch (err) {
                console.error("Gagal menghentikan scanner", err);
            }
        }
    };

    const onScanSuccess = (decodedText) => {
        handleProcessScan(decodedText);
    };

    const onScanFailure = () => {
        // Continuous scanning
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProcessing(true);
        setError(null);

        try {
            // Ensure camera is stopped before scanning file
            await stopCamera();
            
            // Create a temporary scanner instance for file if current one is busy
            const fileScanner = new Html5Qrcode("reader-file-temp", { verbose: false });
            const decodedText = await fileScanner.scanFile(file, true);
            handleProcessScan(decodedText);
        } catch (err) {
            console.error("File scan error:", err);
            setError("QR Code tidak terdeteksi dalam gambar ini. Pastikan gambar jelas dan terang.");
            e.target.value = null;
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        if (scanResult) {
            const timer = setTimeout(() => {
                setScanResult(null);
                if (activeTab === 'camera') {
                    startCamera();
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [scanResult, activeTab]);

    const handleProcessScan = async (data) => {
        setProcessing(true);
        setError(null);
        
        if (activeTab === 'camera') {
            await stopCamera();
        }

        try {
            const response = await axios.post(route('scanner.process'), { qr_data: data });
            setScanResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Verifikasi gagal. Silakan coba lagi.");
            if (activeTab === 'camera') {
                setTimeout(() => {
                    if (!scanResult) startCamera();
                }, 4000);
            }
        } finally {
            setProcessing(false);
        }
    };

    const StepCard = ({ number, title, active }) => (
        <div className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${active ? 'bg-red-50 border border-red-100' : 'bg-gray-50 opacity-60'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${active ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                {number}
            </div>
            <div className="font-bold text-slate-800 text-sm italic-none">{title}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
            <Head title="Scanner Mandiri" />

            <div className="max-w-5xl w-full flex flex-col lg:flex-row-reverse gap-8 lg:gap-12">
                
                {/* Right: Scanner Core - Becomes TOP on Mobile */}
                <div className="w-full lg:w-[55%]">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 flex flex-col">
                        
                        {/* Tabs Selection */}
                        <div className="flex p-1.5 bg-slate-100/80 m-4 rounded-2xl">
                            <button 
                                onClick={() => setActiveTab('camera')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] font-bold text-xs transition-all ${activeTab === 'camera' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                KAMERA
                            </button>
                            <button 
                                onClick={() => setActiveTab('file')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] font-bold text-xs transition-all ${activeTab === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                UPLOAD
                            </button>
                        </div>

                        {/* Scanner Viewport */}
                        <div className="relative aspect-square sm:aspect-video lg:aspect-square bg-slate-950 flex items-center justify-center">
                            
                            {activeTab === 'camera' ? (
                                <div id={qrCodeRegionId} className="w-full h-full"></div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900/50 cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                                        <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    </div>
                                    <span className="text-white font-bold text-sm tracking-wide">PILIH FILE DARI GALERI</span>
                                    <p className="text-slate-500 text-[11px] mt-2 italic-none">Pastikan QR Code terlihat jelas</p>
                                </div>
                            )}

                            {/* Scanning Animation */}
                            {scanning && !processing && !scanResult && activeTab === 'camera' && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="w-64 h-64 border-2 border-white/20 rounded-3xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 animate-scan"></div>
                                        <div className="absolute inset-0 border-r-2 border-l-2 border-red-500/30"></div>
                                    </div>
                                </div>
                            )}

                            {/* Overlays */}
                            {processing && (
                                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
                                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="font-black italic-none uppercase tracking-widest text-sm">Sedang Memproses...</span>
                                </div>
                            )}

                            {scanResult && (
                                <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center text-white p-10 text-center animate-in zoom-in duration-300 ${scanResult.action === 'check-in' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h2 className="text-3xl font-black uppercase mb-2 italic-none">{scanResult.action === 'check-in' ? 'Berhasil Masuk!' : 'Berhasil Keluar!'}</h2>
                                    <p className="font-medium opacity-90 italic-none">{scanResult.message}</p>
                                    <button 
                                        onClick={() => {
                                            setScanResult(null);
                                            if (activeTab === 'camera') startCamera();
                                        }}
                                        className="mt-8 px-10 py-3.5 bg-white text-slate-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform text-xs uppercase"
                                    >
                                        SELESAI
                                    </button>
                                </div>
                            )}

                            {error && !processing && !scanResult && (
                                <div className="absolute inset-0 z-30 bg-red-600 flex flex-col items-center justify-center text-white p-10 text-center animate-in fade-in duration-300">
                                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <h3 className="text-xl font-black uppercase mb-2 italic-none">Verifikasi Gagal</h3>
                                    <p className="text-sm font-medium opacity-80 mb-6 italic-none">{error}</p>
                                    <button 
                                        onClick={() => {
                                            setError(null);
                                            if (activeTab === 'camera') startCamera();
                                        }}
                                        className="px-8 py-3 bg-white text-red-600 font-black rounded-xl text-xs uppercase"
                                    >
                                        COBA LAGI
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-5 bg-white flex justify-center border-t border-slate-50">
                            <Link href="/" className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                KEMBALI KE PENDAFTARAN
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Left: Info & Steps - Becomes BOTTOM on Mobile */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-4">
                            Self Service
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight uppercase">
                            Scanner <br />
                            <span className="text-red-600">E-Tamu.</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-4 max-w-sm mx-auto lg:mx-0 italic-none">
                            Silakan pindai QR Code kunjungan Anda untuk Check-in atau Check-out mandiri.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <StepCard number="1" title="Siapkan QR Code (Email/Screenshot)" active={!scanResult && !processing} />
                        <StepCard number="2" title="Arahkan QR ke Kamera / Upload File" active={!scanResult && !processing} />
                        <StepCard number="3" title="Selesai (Otomatis Check-in/out)" active={scanResult} />
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 hidden lg:block">
                        <div className="flex items-center gap-4">
                            <img src="/logo/image_4.png" alt="Telkom" className="h-8 w-auto grayscale opacity-50" />
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Digital Guestbook System <br /> Telkom Indonesia
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            <div id="reader-file-temp" className="hidden"></div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
                #reader video {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                }
                #reader { border: none !important; }
                .italic-none { font-style: normal !important; }
            ` }} />
        </div>
    );
}
