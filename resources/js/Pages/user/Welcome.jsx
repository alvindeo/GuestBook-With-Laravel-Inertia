import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import '../../../css/welcome.css';

export default function Welcome({ auth }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm({
        phone: '',
        email: '',
        name: '',
        institution: '',
        purpose: '',
    });

    // Handle auto-fill if phone exists
    const checkExistingVisitor = async (phone) => {
        if (phone.length >= 10) {
            try {
                const response = await fetch(`/check-visitor/${phone}`);
                if (!response.ok) return;
                
                const visitor = await response.json();
                if (visitor) {
                    // Use functional update to avoid stale state issues
                    setData(prevData => {
                        // Only auto-fill if the user hasn't cleared the phone or changed it significantly
                        if (prevData.phone !== phone) return prevData;
                        
                        return {
                            ...prevData,
                            name: visitor.name || prevData.name,
                            email: visitor.email || prevData.email,
                            institution: visitor.institution || prevData.institution,
                        };
                    });
                }
            } catch (error) {
                console.error("Error checking visitor:", error);
            }
        }
    };

    // Auto-fill visitor data if phone exists
    useEffect(() => {
        if (data.phone.length >= 10 && currentStep === 1) {
            checkExistingVisitor(data.phone);
        }
    }, [data.phone]);

    // Next step
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            clearErrors();
        }
    };

    // Previous step
    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    // Validate current step
    const validateStep = (step) => {
        let isValid = true;
        clearErrors();

        if (step === 1) {
            if (!data.phone) {
                setError('phone', 'Nomor HP wajib diisi');
                isValid = false;
            } else if (!/^(\+62|0)[0-9]{9,13}$/.test(data.phone)) {
                setError('phone', 'Format nomor HP tidak valid');
                isValid = false;
            }
            
            if (!data.email) {
                setError('email', 'Email wajib diisi');
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(data.email)) {
                setError('email', 'Format email tidak valid');
                isValid = false;
            }
        } else if (step === 2) {
            if (!data.name) {
                setError('name', 'Nama lengkap wajib diisi');
                isValid = false;
            }
            if (!data.institution) {
                setError('institution', 'Asal instansi wajib diisi');
                isValid = false;
            }
        } else if (step === 3) {
            if (!data.purpose) {
                setError('purpose', 'Keperluan wajib diisi');
                isValid = false;
            }
        }

        return isValid;
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(3)) {
            post(route('guestbook.submit'), {
                onSuccess: () => {
                    setShowSuccess(true);
                    reset();
                    setCurrentStep(1);
                },
            });
        }
    };

    return (
        <div className="welcome-page">
            <Head title="E-Tamu Telkom" />
            
            {/* header */}
            <header className={`header ${isScrolled ? 'is-scrolled' : ''}`}>
                <div className="header-top">
                    <div className="logo-container">
                        <img src="/logo/image_4.png" alt="E-Tamu Logo" className="logo-aja" />
                        <div className="logo-text-wrapper">
                            <span className="logo-text-main">E-Tamu</span>
                            <span className="logo-text-sub">Buku Tamu Digital</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* marquee bar moved outside header */}
            <div className="marquee-bar">
                <div className="marquee-content">
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    {/* Duplicate for seamless loop */}
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                    <span className="marquee-item">Selamat Datang di Telkomsel Semarang</span>
                </div>
            </div>

            <main className="main-content">
                {/* form */}
                <div className="form-pane">
                    <div className="stepper">
                        <div className={`step-item ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                            <div className="step-number">{currentStep > 1 ? '' : '1'}</div>
                            <div className="step-label">Kontak</div>
                        </div>
                        <div className={`step-item ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
                            <div className="step-number">{currentStep > 2 ? '' : '2'}</div>
                            <div className="step-label">Data Diri</div>
                        </div>
                        <div className={`step-item ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <div className="step-label">Keperluan</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="form-step">
                                <h3 className="form-title">Informasi Kontak</h3>
                                <div className="form-group">
                                    <label htmlFor="phone">Nomor WhatsApp / HP</label>
                                    <input 
                                        id="phone"
                                        type="tel" 
                                        autoComplete="tel"
                                        placeholder="Contoh: 08123456789"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value.replace(/[^0-9]/g, ''))}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                    />
                                    {errors.phone && <span className="error-message">⚠️ {errors.phone}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Aktif</label>
                                    <input 
                                        id="email"
                                        type="email" 
                                        autoComplete="email"
                                        placeholder="nama@email.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                    />
                                    {errors.email && <span className="error-message">⚠️ {errors.email}</span>}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="form-step">
                                <h3 className="form-title">Informasi Tambahan</h3>
                                <div className="form-group">
                                    <label htmlFor="name">Nama Lengkap</label>
                                    <input 
                                        id="name"
                                        type="text" 
                                        autoComplete="name"
                                        placeholder="Masukkan nama sesuai KTP"
                                        className="uppercase"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase())}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                    />
                                    {errors.name && <span className="error-message">⚠️ {errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="institution">Asal Instansi / Perusahaan</label>
                                    <input 
                                        id="institution"
                                        type="text" 
                                        autoComplete="organization"
                                        placeholder="Tulis '-' jika pribadi"
                                        value={data.institution}
                                        onChange={e => setData('institution', e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), nextStep())}
                                    />
                                    {errors.institution && <span className="error-message">⚠️ {errors.institution}</span>}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="form-step">
                                <h3 className="form-title">Keperluan Kunjungan</h3>
                                <div className="form-group">
                                    <label htmlFor="purpose">Detail Keperluan</label>
                                    <textarea 
                                        id="purpose"
                                        placeholder="Jelaskan secara singkat tujuan kedatangan Anda..."
                                        rows="4"
                                        value={data.purpose}
                                        onChange={e => setData('purpose', e.target.value)}
                                    />
                                    {errors.purpose && <span className="error-message">⚠️ {errors.purpose}</span>}
                                </div>
                            </div>
                        )}

                        <div className="btn-container">
                            {currentStep > 1 ? (
                                <button type="button" onClick={prevStep} className="btn-back">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                    Kembali
                                </button>
                            ) : <div></div>}

                            {currentStep < 3 ? (
                                <button type="button" onClick={nextStep} className="btn-next">
                                    Lanjutkan
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            ) : (
                                <button type="submit" className="btn-next" disabled={processing} style={{ background: 'var(--success)' }}>
                                    {processing ? 'Memproses...' : 'Kirim Data'}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Scanner Link below Form */}
                <div className="scanner-link-container">
                    <Link 
                        href={route('user.scanner')} 
                        className="scanner-alt-btn"
                    >
                        <div className="scanner-icon-bg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 00-1 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div className="scanner-link-text">
                            <span className="text-sm font-bold uppercase tracking-wider">Sudah punya QR Code?</span>
                            <span className="text-[10px] opacity-70 block font-medium">Klik di sini untuk Scan Mandiri</span>
                        </div>
                    </Link>
                </div>
            </main>

            {showSuccess && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="success-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h2>Terima Kasih!</h2>
                        <p>Data kunjungan Anda telah berhasil dicatat. Silahkan hubungi petugas resepsionis untuk langkah selanjutnya.</p>
                        <button onClick={() => setShowSuccess(false)} className="btn-close">
                            Selesai
                        </button>
                    </div>
                </div>
            )}

            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <img src="/logo/image_4.png" alt="E-Tamu Logo" className="footer-logo-aja" />
                        <div className="footer-title-wrapper">
                            <span className="footer-title-main">E-Tamu</span>
                            <span className="footer-title-sub">Buku Tamu Digital</span>
                        </div>
                    </div>
                    
                    <div className="footer-address">
                        Jl. Pahlawan No.10, Pleburan, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50249
                    </div>

                    <div className="footer-socials">
                        <a href="https://www.facebook.com/tselsmg/" target="_blank" className="social-item">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                            https://www.facebook.com/tselsmg/
                        </a>
                        <a href="https://twitter.com/TselSMG" target="_blank" className="social-item">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            @TselSMG
                        </a>
                        <a href="https://www.instagram.com/pioneer.witelsmarangjtu/" target="_blank" className="social-item">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.717 0 3.056.01 4.122.058 1.066.048 1.79.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.637.417 1.361.465 2.427.048 1.066.058 1.405.058 4.122s-.01 3.056-.058 4.122c-.048 1.066-.218 1.79-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.637.247-1.361.417-2.427.465-1.066.048-1.405.058-4.122.058s-3.056-.01-4.122-.058c-1.066-.048-1.79-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.637-.417-1.361-.465-2.427-.047-1.066-.058-1.405-.058-4.122s.01-3.056.058-4.122c.048-1.066.218-1.79.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.523c.637-.247 1.361-.417 2.427-.465C8.944 2.01 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"/></svg>
                            pioneer.witelsmarangjtu
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
