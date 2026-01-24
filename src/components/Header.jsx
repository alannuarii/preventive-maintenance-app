import { createSignal, onMount } from "solid-js";

export default function Header() {
  const [offcanvasId] = createSignal("offcanvasNavbar");

  // Fungsi untuk menutup Offcanvas
  function closeOffcanvas() {
    const offcanvasEl = document.getElementById(offcanvasId());
    if (!offcanvasEl) return;
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  }

  // Jika ingin menghindari efek melebar dropdown, gunakan class Bootstrap yang sudah ada
  return (
    <div class="header">
      <nav class="navbar navbar-expand-lg bg-light shadow-sm fixed-top">
        <div class="container-fluid">
          <div class="navbar-brand">
            <img src="/img/np.png" alt="Logo" height="40" class="d-inline-block align-text-top me-3" />
          </div>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/">
                  Beranda
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/preventive">
                  Jadwal PM
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
