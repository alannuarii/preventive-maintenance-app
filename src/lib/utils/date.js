export function convertTime(waktu, format = 3) {
    const dt = new Date(waktu);
    // dt.setHours(dt.getHours()); // Kurangi 8 jam

    const bulanIndonesia = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const hariIndonesia = [
        'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ];

    switch (format) {
        case 1:
            return `${dt.getDate()} ${bulanIndonesia[dt.getMonth()]} ${dt.getFullYear()} Pukul ${dt.getHours()} WITA`;
        case 2:
            return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}:${String(dt.getSeconds()).padStart(2, '0')}`;
        case 3:
            return `${hariIndonesia[dt.getDay()]}, ${dt.getDate()} ${bulanIndonesia[dt.getMonth()]} ${dt.getFullYear()}`;
        default:
            return dt.toISOString();
    }
}

export function convertDecimalDaysToDaysHours(decimalDays) {
    const days = Math.floor(decimalDays);
    const hours = Math.round((decimalDays - days) * 24);
    return `${days} hari ${hours} jam`;
}
