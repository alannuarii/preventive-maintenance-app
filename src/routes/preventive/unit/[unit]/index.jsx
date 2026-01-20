import { onMount, onCleanup, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { generatePMSchedule } from "../../../../lib/utils/pmSchedule";
import "./index.css";

export default function PreventiveUnit() {
  let calendarRef;
  let calendarInstance;
  const params = useParams();

  const [currentHours, setCurrentHours] = createSignal([]);

  onMount(async () => {
    try {
      const unit = params.unit;
      const response = await fetch(`/api/servicehour/${unit}`);
      const data = await response.json();

      setCurrentHours(data);

      // initialize calendar once
      calendarInstance = new Calendar(calendarRef, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        events: generatePMSchedule(data),
        height: "auto",
        contentHeight: "auto",
        aspectRatio: 1.5,
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
    <div>
      <div class="text-center mb-3">
        <h3 class="title">JADWAL PREVENTIVE MAINTENANCE</h3>
      </div>
      <div class="calendar-container mb-5">
        <div id="calendar">
          <div ref={(el) => (calendarRef = el)} />
        </div>
      </div>
    </div>
  );
}
