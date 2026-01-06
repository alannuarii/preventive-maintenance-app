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
      <header class="navbar navbar-expand-lg navbar-light bg-dark-subtle fixed-top shadow-sm">
        <div class="container-fluid h-100 d-flex align-items-center">
          <a class="navbar-brand" href="/">
            <img src="/img/np.png" alt="Logo" height="40" class="d-inline-block align-text-top me-3" />
          </a>

          {/* Tombol toggle Offcanvas - hanya muncul di mobile (xs-sm) */}
          <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target={`#${offcanvasId()}`} aria-controls={offcanvasId()} aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          {/* Navigasi navbar - muncul di md ke atas */}
          <nav class="d-none d-md-flex ms-auto h-100 align-items-center">
            <ul class="navbar-nav flex-row gap-3 h-100 align-items-center">
              <li class="nav-item dropdown h-100">
                <div class="text-dark dropdown-toggle h-100 d-flex align-items-center justify-content-center" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="true">
                  Preventive Maintenance
                </div>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" href="/preventive">
                      Jadwal PM
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="/preventive/realisasi/input">
                      Input Realisasi PM
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="/preventive/realisasi">
                      Realisasi PM
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="/periodic">
                  Periodic Maintenance
                </a>
              </li>
              <li class="nav-item dropdown h-100">
                <div class="text-dark dropdown-toggle h-100 d-flex align-items-center justify-content-center" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="true">
                  Material
                </div>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" href="/material/list">
                      Daftar Material
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="/material/plan">
                      Perencanaan Material PM
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* Offcanvas menu untuk mobile */}
          <div class="offcanvas offcanvas-end d-md-none" tabindex="-1" id={offcanvasId()} aria-labelledby={`${offcanvasId()}Label`}>
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id={`${offcanvasId()}Label`}>
                Menu
              </h5>
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item fw-bold">Preventive Maintenance</li>
                <a href="/preventive" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Jadwal PM
                </a>
                <a href="/preventive/realisasi/input" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Input Realisasi PM
                </a>
                <a href="/preventive/realisasi" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Realisasi PM
                </a>
                <li class="list-group-item fw-bold">Periodic maintenance</li>
                <li class="list-group-item fw-bold">Material</li>
                <a href="/material/list" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Daftar Material
                </a>
                <a href="/material/plan" class="list-group-item list-group-item-action ms-3" onClick={closeOffcanvas}>
                  Perencanaan Material PM
                </a>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
