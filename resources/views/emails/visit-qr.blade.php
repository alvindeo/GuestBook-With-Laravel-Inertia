<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #dc2626;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .visitor-name {
            font-size: 22px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 10px;
        }
        .qr-section {
            margin: 30px 0;
            padding: 20px;
            background: #fafafa;
            border: 2px dashed #ddd;
            display: inline-block;
            border-radius: 15px;
        }
        .qr-section img {
            display: block;
            margin: 0 auto;
        }
        .instructions {
            text-align: left;
            background: #fff9f9;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
            margin-top: 30px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>E-TAMU TELKOM</h1>
        </div>
        
        <div class="content">
            <p>Halo,</p>
            <div class="visitor-name">{{ strtoupper($visit->visitor->name) }}</div>
            <p>Terima kasih telah melakukan pendaftaran di Buku Tamu Digital Telkom Indonesia.</p>
            
            <p>Berikut adalah <strong>QR CODE</strong> unik Anda:</p>
            
            <div class="qr-section">
                <!-- Menggunakan API External agar gambar PASTI muncul di Gmail (Format PNG) -->
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={{ $visit->barcode_token }}&color=dc2626" alt="QR Code Kunjungan" width="250" style="display: block; margin: 0 auto;">
            </div>
            
            <div class="instructions">
                <strong>💡 Cara Penggunaan:</strong>
                <ul style="padding-left: 20px; margin-top: 10px;">
                    <li>Tunjukkan QR Code ini ke petugas atau pindaikan secara mandiri pada mesin scanner yang tersedia.</li>
                    <li>QR Code ini berlaku untuk <strong>Check-in</strong> saat datang dan <strong>Check-out</strong> saat keluar.</li>
                    <li>Pastikan layar perangkat Anda cerah saat melakukan pemindaian.</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} Telkom Indonesia Regional 4. Data ini dibuat secara otomatis oleh sistem.
        </div>
    </div>
</body>
</html>
