import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";

export default function Menu() {
  const [menuVisible, setMenuVisible] = createSignal(false);

  const menuItems = [
    { label: "Home", icon: "bi bi-house-fill", to: "/" },
    { label: "Profile", icon: "bi bi-person-fill", to: "#" },
    { label: "Logout", icon: "bi-box-arrow-right", to: "/api/auth/logout" }, // arahkan ke endpoint logout
  ];

  const menuStyle = {
    bottom: "60px",
    left: "10px",
    minWidth: "180px",
    backgroundColor: "white",
    borderRadius: "0.25rem",
    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    zIndex: 1100,
  };

  function handleLogout() {
    window.location.href = "/api/auth/logout"; // redirect ke logout API
  }

  return (
    <>
      {/* Bottom Menu: hanya tampil di mobile */}
      <nav class="menu navbar fixed-bottom navbar-light bg-dark-subtle d-lg-none shadow-lg">
        <div class="container justify-content-around">
          {menuItems.map((item) =>
            item.label === "Logout" ? (
              <a
                href="#"
                class="nav-link text-center text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                  setMenuVisible(false);
                }}
              >
                <i class={item.icon}></i>
                <div class="label">{item.label}</div>
              </a>
            ) : (
              <a href={item.to} class="nav-link text-center text-dark">
                <i class={item.icon}></i>
                <div class="label">{item.label}</div>
              </a>
            )
          )}
        </div>
      </nav>

      {/* Desktop Floating Menu Button dan Dropdown */}
      <div class="d-none d-lg-block">
        <button
          class="btn btn-secondary position-fixed bottom-0 start-0 m-2 rounded-circle"
          style={{ width: "40px", height: "40px", fontSize: "16px", zIndex: 1100 }}
          onClick={() => setMenuVisible(!menuVisible())}
          aria-label="Toggle navigation menu"
          classList={{ rotate: menuVisible() }}
        >
          ☰
        </button>

        <Show when={menuVisible()}>
          <div class="position-fixed start-0 p-2 d-flex flex-column" style={menuStyle}>
            {menuItems.map((item) =>
              item.label === "Logout" ? (
                <a
                  href="#"
                  class="mb-1 py-2 px-3 bg-white border rounded card-menu d-block text-decoration-none text-dark"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                    setMenuVisible(false);
                  }}
                  tabIndex={0}
                  role="button"
                >
                  <i class={item.icon + " me-2"}></i>
                  {item.label}
                </a>
              ) : (
                <A href={item.to} class="mb-1 py-2 px-3 bg-white border rounded card-menu d-block text-decoration-none text-dark" onClick={() => setMenuVisible(false)} tabIndex={0} role="button">
                  <i class={item.icon + " me-2"}></i>
                  {item.label}
                </A>
              )
            )}
          </div>
        </Show>
      </div>
    </>
  );
}
