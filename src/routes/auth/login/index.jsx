export default function Login() {
  return (
    <section class="container-fluid d-flex justify-content-center align-items-center w-25">
      <div class="bg-dark p-5">
        <div class="d-flex justify-content-center">
          <img src="/img/np.png" class="img-fluid mb-4 custom-logo" alt="Logo" width={`50%`} />
        </div>
        <div class="text-center text-light">
          <h4 class="fw-bold">LOGIN</h4>
          <h5 class="fw-light">PLTD TAHUNA SUPER APP</h5>
        </div>
        <div>
          <button
            class="btn btn-secondary w-100 rounded-0"
            onClick={() => {
              window.location.href = "/api/auth/login";
            }}
          >
            <i class="bi-google me-2"></i>Login with Google Account
          </button>
        </div>
      </div>
    </section>
  );
}
