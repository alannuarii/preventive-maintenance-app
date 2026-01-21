import { onMount, onCleanup, createSignal, Show } from "solid-js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./index.css";
import { generatePMSchedule } from "~/lib/utils/pmSchedule";
import { engines } from "~/lib/data/engineData";

export default function Home() {
  let calendarRef;
  let calendarInstance;
  const [currentHours, setCurrentHours] = createSignal([]);

  onMount(async () => {
    try {
      const response = await fetch("/api/servicehour");
      const data = await response.json();
      const pmData = generatePMSchedule(data);

      const fullData = data.map(({ unit, jamoperasi }) => {
        const engine = engines().find((e) => e.unit === unit);
        const pm = pmData.find((pm) => pm.extendedProps.unit === unit) || { title: "No PM Scheduled", id: "" };
        return {
          unit,
          jamoperasi,
          mesin: engine.mesin,
          pm: pm.title,
          tanggal: pm.start,
        };
      });

      setCurrentHours(fullData);
      console.log("Full Data:", fullData); // Debug: cek data lengkap sebelum generate jadwal

      calendarInstance = new Calendar(calendarRef, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        events: generatePMSchedule(fullData),
        height: "auto",
        contentHeight: "auto",
        aspectRatio: 1.5,
        // eventClick dihilangkan sesuai permintaan
      });

      calendarInstance.render();
    } catch (error) {
      console.error("Failed to fetch service hour data:", error);
    }
  });

  onCleanup(() => {
    if (calendarInstance) {
      calendarInstance.destroy();
      calendarInstance = null;
    }
  });

  return (
    <div class="home">
      <Show when={currentHours().length > 0} fallback={<div>Loading data...</div>}>
        <div>
          <div class="row gx-5">
            <div class="col-md-8">
              <h1>tes</h1>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Unit</th>
                    <th scope="col">Mesin</th>
                    <th scope="col">PM Selanjutnya</th>
                    <th scope="col">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHours().map((item) => (
                    <tr>
                      <td>{item.unit}</td>
                      <td>{item.mesin}</td>
                      <td>{item.pm}</td>
                      <td>{item.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div class="col-md-4">
              <div class="calendar-container mb-5">
                <div id="calendar">
                  <div ref={(el) => (calendarRef = el)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
