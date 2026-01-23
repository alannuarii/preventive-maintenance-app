// @refresh reload
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show, createEffect } from "solid-js";
import { MetaProvider, Title, Link } from "@solidjs/meta";
import Header from "./components/Header";
import "./app.css";

function RootLayout(props) {
  const location = useLocation();

  // Jangan tampilkan Header & BackButton jika URL diawali dengan "/auth"
  const isAuthPage = () => location.pathname.startsWith("/auth");

  return (
    <div class="min-vh-100">
      <Show when={!isAuthPage()}>
        <div class="app-bg">
          <Header />
          <div class="container content">
            <Suspense>{props.children}</Suspense>
          </div>
        </div>
      </Show>

      {/* Jika halaman auth, tampilkan children saja tanpa header, menu */}
      <Show when={isAuthPage()}>
        <Suspense>{props.children}</Suspense>
      </Show>
    </div>
  );
}

export default function App() {
  createEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) => console.error("Service Worker registration failed:", err));
    }
  });
  return (
    <MetaProvider>
      {/* Set Title halaman */}
      <Title>Preventive Maintenance App</Title>

      {/* Bootstrap CSS */}
      <Link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>

      {/* Bootstrap JS Bundle (dengan Popper) */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" crossOrigin="anonymous" />

      {/* Routing dan Layout */}
      <Router root={RootLayout}>
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
