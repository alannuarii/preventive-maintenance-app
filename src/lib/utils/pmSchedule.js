import { pmCycles } from "../data/pmCycles.js";
import { generateRandomId } from "./random.js";

export const generatePMSchedule = (units, startDateStr = null, endDateStr = null) => {
    const colorsByUnit = {
        1: "#FF5733",
        4: "#33FF57",
        5: "#3357FF",
        6: "#F1C40F",
        7: "#9B59B6",
        8: "#E67E22",
        9: "#1ABC9C",
    };

    const fiveYearHours = 24 * 1825; // default 5 tahun dalam jam
    const maxIterations = 1000;

    // Tanggal hari ini di-reset ke awal hari (00:00) - jadi ini selalu start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Base date tetap hari ini, tidak terpengaruh oleh startDateStr
    let baseDate = new Date(today);

    // Parsing tanggal akhir, jika tidak ada pakai default durasi 5 tahun dari baseDate
    let endDate = endDateStr ? new Date(endDateStr) : new Date(baseDate.getTime() + fiveYearHours * 60 * 60 * 1000);
    endDate.setHours(23, 59, 59, 999);

    let allSchedules = [];

    units.forEach(({ unit, jamoperasi }) => {
        let reducedHours = jamoperasi % 3000;
        let cycleHours = reducedHours;
        let currentBaseDate = new Date(baseDate);

        for (let i = 0; i < maxIterations; i++) {
            const pmCycle = pmCycles.find(cycle => cycle.min <= cycleHours && cycleHours < cycle.max);
            if (!pmCycle) break;

            const targetHours = pmCycle.max;
            const hoursToNextPM = targetHours - cycleHours;
            if (hoursToNextPM <= 0) break;

            const daysToNextPM = hoursToNextPM / 24;
            let pmDate = new Date(currentBaseDate.getTime());
            pmDate.setDate(pmDate.getDate() + Math.ceil(daysToNextPM));
            pmDate.setHours(0, 0, 0, 0);

            if (pmDate > endDate) break;

            const eventId = generateRandomId(10);

            allSchedules.push({
                id: eventId,
                title: `${pmCycle.pm} #${unit}`,
                start: pmDate.toISOString().slice(0, 10),
                allDay: true,
                color: colorsByUnit[unit] || "#000000",
                extendedProps: {
                    currentHours: cycleHours,
                    targetHours: targetHours,
                    daysFromToday: daysToNextPM,
                    unit: unit,
                    url: `/preventive/detail/${eventId}`,
                },
            });

            cycleHours = targetHours;
            if (cycleHours >= 3000) cycleHours -= 3000;
            currentBaseDate = new Date(pmDate);
        }
    });

    // Jika ada batasan rentang startDateStr, lakukan filter result di sini
    if (startDateStr) {
        const startDateFilter = new Date(startDateStr);
        startDateFilter.setHours(0, 0, 0, 0);
        allSchedules = allSchedules.filter(schedule => {
            const scheduleDate = new Date(schedule.start);
            return scheduleDate >= startDateFilter && scheduleDate <= endDate;
        });
    }

    return allSchedules;
};
