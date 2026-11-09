/* Página: index.html (login) */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.username.value;
    const password = form.password.value;

    if (Store.login(email, password)) {
      window.location.href = "dashboard.html";
    } else {
      toast("Usuario o contraseña incorrectos.", false);
    }
  });

  document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
    e.preventDefault();
    toast("Contacta al administrador del sistema para restablecer tu contraseña.");
  });
});
