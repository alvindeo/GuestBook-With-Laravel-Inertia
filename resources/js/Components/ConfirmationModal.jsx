import { Fragment } from 'react';

export default function ConfirmationModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = "Konfirmasi", 
    message, 
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    type = "primary" // primary, danger, success
}) {
    if (!show) return null;

    const typeStyles = {
        primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    };

    const iconColors = {
        primary: "text-blue-600",
        danger: "text-red-600",
        success: "text-green-600",
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-full bg-${type === 'danger' ? 'red' : type === 'success' ? 'green' : 'blue'}-100 flex items-center justify-center`}>
                            {type === 'danger' ? (
                                <svg className={`w-8 h-8 ${iconColors[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            ) : type === 'success' ? (
                                <svg className={`w-8 h-8 ${iconColors[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className={`w-8 h-8 ${iconColors[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <div className="text-center text-gray-600 mb-6">
                        {message}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${typeStyles[type]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
