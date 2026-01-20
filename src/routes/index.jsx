import { onMount, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { engines } from "~/lib/data/engineData";
import { generatePMSchedule } from "~/lib/utils/pmSchedule";
import { convertTime } from "~/lib/utils/date";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./index.css";

export default function Home() {
  let calendarRef;
  let calendarInstance;
  const [currentHours, setCurrentHours] = createSignal([]);

  onMount(async () => {
    try {
      const response = await fetch("/api/servicehour");
      const data = await response.json();

      const fullData = data.map(({ unit, jamoperasi }) => {
        const engine = engines().find((e) => e.unit === unit);
        return {
          unit,
          jamoperasi,
          mesin: engine ? `${engine.mesin} Unit ${engine.unit}` : `Unit ${unit}`,
        };
      });

      setCurrentHours(fullData);
      console.log("Full Data:", fullData); // Debug: cek data lengkap sebelum generate jadwal

    //   calendarInstance = new Calendar(calendarRef, {
    //     plugins: [dayGridPlugin],
    //     initialView: "dayGridMonth",
    //     events: generatePMSchedule(fullData),
    //     height: "auto",
    //     contentHeight: "auto",
    //     aspectRatio: 1.5,
    //     // eventClick dihilangkan sesuai permintaan
    //   });

    //   calendarInstance.render();
    } catch (error) {
      console.error("Failed to fetch service hour data:", error);
    }
  });

//   onCleanup(() => {
//     if (calendarInstance) {
//       calendarInstance.destroy();
//       calendarInstance = null;
//     }
//   });

  return (
    <div class="home">
      <Show when={currentHours().length > 0} fallback={<div>Loading data...</div>}>
        <div class="row">
          <div class="col-6">
            <h2>Current Service Hours</h2>
          </div>
          {/* <div class="col-6 calendar-container mb-5">
            <div id="calendar">
              <div ref={(el) => (calendarRef = el)} />
            </div>
          </div> */}
        </div>
      </Show>
    </div>
  );
}
