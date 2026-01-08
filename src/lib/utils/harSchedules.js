export function generatePMScheduleForSingleUnit(cyclesPerUnit, cycleTable) {
    const events = [];
    const baseDate = new Date();
    const endDate = new Date(baseDate);
    endDate.setFullYear(baseDate.getFullYear() + 5); // 5 years ahead

    if (!cycleTable || cycleTable.length === 0) return events;

    // Mungkin kita tidak perlu cari cycle saat ini dengan min/max?
    // Tapi kita harus pastikan kita mulai dari siklus yang benar
    // Jadi kita cari dengan min/max untuk menentukan PM current

    const currentCycle = cycleTable.find(
        (entry) => cyclesPerUnit >= entry.min && cyclesPerUnit < entry.max
    );

    if (!currentCycle) {
        console.warn("No valid cycle found for current hours:", cyclesPerUnit);
        return events;
    }

    // Hitung berapa jam yang tersisa dari currentHours ke akhir siklus saat ini
    const hoursUntilNextCycle = currentCycle.max - cyclesPerUnit;

    // Hitung tanggal saat siklus PM berikutnya terjadi
    let currentDate = new Date(baseDate.getTime() + (hoursUntilNextCycle * 60 * 60 * 1000));

    // Kita mulai dari siklus yang valid, dan terus berlanjut dengan interval
    let currentCycleIndex = cycleTable.findIndex(
        (entry) => entry.min === currentCycle.min && entry.max === currentCycle.max
    );

    // Jika indeks tidak ditemukan, gunakan 0
    if (currentCycleIndex === -1) currentCycleIndex = 0;

    // Loop hingga melewati batas 5 tahun
    while (currentDate <= endDate) {
        // Cek apakah kita masih memiliki siklus yang valid
        if (currentCycleIndex >= cycleTable.length) break;

        const cycleEntry = cycleTable[currentCycleIndex];

        // Format tanggal
        const formattedDate = currentDate.toISOString().split("T")[0];

        // Tambahkan event
        events.push({
            title: cycleEntry.pm,
            date: formattedDate,
        });

        // Hitung tanggal berikutnya: tambahkan interval
        const intervalMs = cycleEntry.interval * 60 * 60 * 1000;
        currentDate = new Date(currentDate.getTime() + intervalMs);

        // Pindah ke siklus berikutnya (berikutnya dalam list)
        currentCycleIndex++;
    }

    return events;
}
