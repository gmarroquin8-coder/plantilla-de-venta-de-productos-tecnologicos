const form = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const loginMessage = document.querySelector("#form-message");
const registerMessage = document.querySelector("#register-message");
const sessionPanel = document.querySelector("#session-panel");
const loginFooter = document.querySelector("#login-footer");
const registerFooter = document.querySelector("#register-footer");
const pageTitle = document.querySelector("#page-title");
const pageIntro = document.querySelector("#page-intro");

function setMessage(element, text, isError = false) {
  element.textContent = text;
  element.classList.toggle("error", isError);
}

function showLoginForm() {
  form.hidden = false;
  registerForm.hidden = true;
  sessionPanel.hidden = true;
  loginFooter.hidden = false;
  registerFooter.hidden = true;
  pageTitle.textContent = "Bienvenido de nuevo";
  pageIntro.textContent = "Inicia sesión para continuar en tu cuenta.";
  setMessage(loginMessage, "");
  setMessage(registerMessage, "");
}

function showRegisterForm() {
  form.hidden = true;
  registerForm.hidden = false;
  sessionPanel.hidden = true;
  loginFooter.hidden = true;
  registerFooter.hidden = false;
  pageTitle.textContent = "Crear cuenta";
  pageIntro.textContent = "Regístrate para crear tu cuenta.";
  setMessage(loginMessage, "");
  setMessage(registerMessage, "");
}

function showSession(user) {
  form.hidden = true;
  registerForm.hidden = true;
  sessionPanel.hidden = false;
  loginFooter.hidden = true;
  registerFooter.hidden = true;
  pageTitle.textContent = "Sesión iniciada";
  pageIntro.textContent = "";
  document.querySelector("#session-message").textContent = `Bienvenido, ${user.name}.`;
}

document.querySelector("#toggle-password").addEventListener("click", (event) => {
  const passwordInput = document.querySelector("#password");
  const button = event.currentTarget;
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  button.setAttribute("aria-pressed", String(!isVisible));
  button.setAttribute("aria-label", isVisible ? "Mostrar contraseña" : "Ocultar contraseña");
});

document.querySelector("#show-register").addEventListener("click", showRegisterForm);
document.querySelector("#show-login").addEventListener("click", showLoginForm);
document.querySelector("#enter-store").addEventListener("click", () => {
  window.location.assign("/");
});

document.querySelector("#forgot-password").addEventListener("click", () => {
  setMessage(loginMessage, "La recuperación de contraseña aún no está disponible.", true);
});

async function submitAuth(endpoint, payload, messageElement, submitButton) {
  submitButton.disabled = true;
  setMessage(messageElement, "Procesando…");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(messageElement, result.error || "No se pudo completar la solicitud.", true);
      return;
    }

    showSession(result.user);
  } catch {
    setMessage(messageElement, "No se pudo conectar con el servidor. Inténtalo de nuevo.", true);
  } finally {
    submitButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    setMessage(loginMessage, "Revisa el correo y la contraseña antes de continuar.", true);
    return;
  }

  submitAuth(
    "/api/auth/login",
    {
      email: form.elements.email.value,
      password: form.elements.password.value,
      remember: form.elements.remember.checked
    },
    loginMessage,
    form.querySelector(".submit-button")
  );
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!registerForm.reportValidity()) return;

  const password = registerForm.elements.password.value;
  if (password !== registerForm.elements["confirm-password"].value) {
    setMessage(registerMessage, "Las contraseñas no coinciden.", true);
    return;
  }

  submitAuth(
    "/api/auth/register",
    {
      name: registerForm.elements.name.value,
      email: registerForm.elements.email.value,
      password
    },
    registerMessage,
    registerForm.querySelector(".submit-button")
  );
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  const button = document.querySelector("#logout-button");
  button.disabled = true;
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      setMessage(document.querySelector("#session-message"), "No se pudo cerrar la sesión.", true);
      return;
    }
    form.reset();
    showLoginForm();
    setMessage(loginMessage, "Sesión cerrada.");
  } catch {
    setMessage(document.querySelector("#session-message"), "No se pudo conectar con el servidor.", true);
  } finally {
    button.disabled = false;
  }
});

fetch("/api/auth/me")
  .then(async (response) => {
    if (response.status === 401) return;
    if (!response.ok) throw new Error("No se pudo validar la sesión.");
    const result = await response.json();
    showSession(result.user);
  })
  .catch(() => {
    setMessage(loginMessage, "No se pudo conectar con el servidor. Inténtalo de nuevo.", true);
  });
