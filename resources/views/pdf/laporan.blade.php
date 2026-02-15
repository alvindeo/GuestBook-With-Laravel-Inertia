<!DOCTYPE html>
<html>
<head>
    <title>Laporan Kunjungan Tamu</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #ed1c24;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #ed1c24;
            margin: 0;
            text-transform: uppercase;
            font-size: 20pt;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
            font-size: 10pt;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #f2f2f2;
            color: #333;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
            font-size: 9pt;
        }
        td {
            padding: 8px;
            border: 1px solid #ddd;
            vertical-align: top;
            font-size: 9pt;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10pt;
        }
        .status-in {
            color: #10b981;
            font-weight: bold;
        }
        .status-out {
            color: #6b7280;
        }
        .date {
            text-align: right;
            margin-bottom: 10px;
            font-size: 9pt;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN KUNJUNGAN TAMU</h1>
        <p>PT. Telkom Indonesia - Guestbook System</p>
    </div>

    <div class="date">
        Dicetak pada: {{ now()->format('d F Y H:i') }} WIB
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="20%">Nama / Instansi</th>
                <th width="20%">Tujuan</th>
                <th width="20%">Waktu Check-In</th>
                <th width="10%">Durasi</th>
                <th width="10%">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($visits as $index => $visit)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $visit->visitor->name }}</strong><br>
                    <small style="color: #666;">{{ $visit->visitor->institution }}</small>
                </td>
                <td>{{ $visit->purpose }}</td>
                <td>
                    {{ $visit->created_at->format('d/m/Y') }}<br>
                    <small>{{ $visit->created_at->format('H:i') }} WIB</small>
                </td>
                <td>{{ $visit->duration_minutes ? $visit->duration_minutes . 'm' : '-' }}</td>
                <td>
                    <span class="{{ $visit->status === 'in' ? 'status-in' : 'status-out' }}">
                        {{ $visit->status === 'in' ? 'DI DALAM' : 'KELUAR' }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Mengetahui,</p>
        <br><br><br>
        <p><strong>Admin Guestbook</strong></p>
    </div>
</body>
</html>
