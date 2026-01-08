import { onMount, onCleanup, createSignal } from "solid-js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./index.css";
import { generatePMScheduleForSingleUnit } from "../../src/lib/utils/harSchedules";
import { harCyclesCummins } from "../lib/data/cummins";

export default function Home() {
  let calendarRef;
  let calendarInstance;
  const [currentHours, setCurrentHours] = createSignal([]);

  // ✅ Data dummy untuk /api/servicehour
  const dummyServiceHourData = [
    { unit: "unit1", jamoperasi: 1000 },
  ];

  const engines = () => [
    { unit: "unit1", mesin: "Cummins" },
  ];

  onMount(async () => {
    // ✅ Gunakan data dummy alih-alih fetch dari API
    const data = dummyServiceHourData;

    const fullData = data.map(({ unit, jamoperasi }) => {
      const engine = engines().find((e) => e.unit === unit);
      return {
        unit,
        jamoperasi,
        mesin: engine ? `${engine.mesin} Unit ${engine.unit}` : `Unit ${unit}`,
      };
    });

    setCurrentHours(fullData);

    // Inisialisasi kalender
    calendarInstance = new Calendar(calendarRef, {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
      events: [], // Mulai kosong, akan diisi nanti
      height: "auto",
      contentHeight: "auto",
      aspectRatio: 1.5,
      // eventClick: (info) => console.log("Event clicked:", info.event),
    });

    calendarInstance.render();

    // ✅ Atur jadwal default untuk unit pertama (unit1)
    const selectedUnit = "unit1";
    updateCalendarSchedule(selectedUnit);
  });

  onCleanup(() => {
    if (calendarInstance) {
      calendarInstance.destroy();
      calendarInstance = null;
    }
  });

  const updateCalendarSchedule = (unit) => {
    const selectedData = currentHours().find((h) => h.unit === unit);
    if (!selectedData) return;

    const events = generatePMScheduleForSingleUnit(selectedData.jamoperasi, harCyclesCummins);
    calendarInstance.setOption("events", events);
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value !== "all") {
      window.location.href = `/preventive/unit/${value}`;
      updateCalendarSchedule(value);
    } else {
      // Jika "Semua Mesin", bisa kembali ke tampilan semua unit (jika nanti dibuat)
      // Untuk sekarang, kita fokus ke satu unit saja
      calendarInstance.setOption("events", []);
    }
  };

  return (
    <div>
      <div class="text-center mb-3">
        <h3 class="title">JADWAL PREVENTIVE MAINTENANCE</h3>
      </div>
      <div class="row">
        <div class="col-md-4 mx-auto mb-3">
          <label htmlFor="unitSelect" class="form-label">
            Pilih Mesin:
          </label>
          <select class="form-select" id="unitSelect" onChange={handleSelectChange} defaultValue="unit1">
            <option value="all">Semua Mesin</option>
            {currentHours().map(({ unit, mesin }) => (
              <option value={unit} key={unit}>
                {mesin}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div class="calendar-container mb-5">
        <div id="calendar">
          <div ref={(el) => (calendarRef = el)} />
        </div>
      </div>
    </div>
  );
}
