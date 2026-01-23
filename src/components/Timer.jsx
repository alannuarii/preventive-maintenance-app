import { createSignal, onCleanup } from "solid-js";
import "./Timer.css"; // ⬅️ Import CSS

export default function Timer() {
  const [waktu, setWaktu] = createSignal("");

  const updateWaktu = () => {
    const hariIndonesia = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulanIndonesia = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const now = new Date();
    const hari = hariIndonesia[now.getDay()];
    const tanggal = now.getDate();
    const bulan = bulanIndonesia[now.getMonth()];
    const tahun = now.getFullYear();
    const jam = String(now.getHours()).padStart(2, "0");
    const menit = String(now.getMinutes()).padStart(2, "0");
    const detik = String(now.getSeconds()).padStart(2, "0");

    setWaktu(`${hari}, ${tanggal} ${bulan} ${tahun} ${jam}:${menit}:${detik}`);
  };

  updateWaktu();
  const interval = setInterval(updateWaktu, 1000);
  onCleanup(() => clearInterval(interval));

  return <p class="timer">{waktu()}</p>;
}
