(function () {
  "use strict";

  const views = ["loading", "setup", "login", "reset", "app"];
  function show(name) {
    views.forEach((v) => {
      document.getElementById("view-" + v).hidden = v !== name;
    });
  }
  function setMsg(el, text, ok) {
    el.textContent = text || "";
    el.classList.toggle("ok", !!ok);
  }

  const cfg = window.DIRESTRAITS_CONFIG || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
    show("setup");
    return;
  }

  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  // Arriving from an invite or password-reset email link.
  const hash = window.location.hash;
  let mustSetPassword = /type=(recovery|invite)/.test(hash);

  function render(session) {
    if (mustSetPassword && session) return show("reset");
    if (session) {
      document.getElementById("user-email").textContent = session.user.email || "";
      show("app");
    } else {
      show("login");
    }
  }

  sb.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") mustSetPassword = true;
    render(session);
  });

  sb.auth.getSession().then(({ data }) => render(data.session));

  // Sign in
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("login-msg");
  const loginBtn = document.getElementById("login-btn");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    if (!email || !password) return setMsg(loginMsg, "Enter your email and password.");
    loginBtn.disabled = true;
    setMsg(loginMsg, "");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    loginBtn.disabled = false;
    if (error) setMsg(loginMsg, "Sign-in failed. Check your email and password.");
    else loginForm.password.value = "";
  });

  // Forgot password
  document.getElementById("forgot-btn").addEventListener("click", async () => {
    const email = loginForm.email.value.trim();
    if (!email) return setMsg(loginMsg, "Enter your email above first.");
    const redirectTo = window.location.origin + window.location.pathname;
    await sb.auth.resetPasswordForEmail(email, { redirectTo });
    // Same message either way so this can't be used to check which emails have accounts.
    setMsg(loginMsg, "If that email has access, a reset link is on its way.", true);
  });

  // Set new password
  const resetForm = document.getElementById("reset-form");
  const resetMsg = document.getElementById("reset-msg");
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("new-password").value;
    if (password.length < 8) return setMsg(resetMsg, "Use at least 8 characters.");
    const { error } = await sb.auth.updateUser({ password });
    if (error) return setMsg(resetMsg, error.message);
    mustSetPassword = false;
    history.replaceState(null, "", window.location.pathname);
    const { data } = await sb.auth.getSession();
    render(data.session);
  });

  // Sign out
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await sb.auth.signOut();
    show("login");
  });
})();
