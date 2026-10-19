(() => {
  const config = window.VOCALFLOW_SUPABASE_CONFIG || {};
  const isLoginPage = document.body.classList.contains("auth-page-body");
  const notice = document.getElementById("authDemoNotice");
  const identity = document.getElementById("authIdentity");
  const signOutButton = document.getElementById("authSignOut");
  const loginLink = document.getElementById("authLoginLink");
  const message = document.getElementById("authMessage");
  const demoWarning = document.getElementById("authDemoWarning");
  const loginForm = document.getElementById("authLoginForm");
  const resetForm = document.getElementById("authResetForm");
  const updateForm = document.getElementById("authUpdateForm");
  const title = document.getElementById("authTitle");
  const intro = document.getElementById("authIntro");

  function setMessage(text, isError = false) {
    if (!message) return;
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  function setBusy(form, busy) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = busy;
    button.textContent = busy ? "처리 중..." : button.dataset.label;
  }

  [loginForm, resetForm, updateForm].filter(Boolean).forEach((form) => {
    const button = form.querySelector('button[type="submit"]');
    button.dataset.label = button.textContent;
  });

  function setView(view) {
    if (!loginForm) return;
    loginForm.hidden = view !== "login";
    resetForm.hidden = view !== "reset";
    updateForm.hidden = view !== "update";
    title.textContent = view === "reset" ? "비밀번호 재설정" : view === "update" ? "새 비밀번호 설정" : "로그인";
    intro.hidden = view !== "login";
    setMessage("");
  }

  function getReturnTo() {
    const requested = new URLSearchParams(window.location.search).get("returnTo");
    if (requested && requested.startsWith("/") && !requested.startsWith("//")) return requested;
    return "./index.html";
  }

  function getLoginUrl(returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    const url = new URL("./login.html", window.location.href);
    url.searchParams.set("returnTo", returnTo || "./index.html");
    return url;
  }

  function showNotice(text, email, authenticated = false) {
    if (!notice) return;
    notice.firstChild.textContent = text;
    if (identity) identity.textContent = email ? `로그인 계정: ${email}` : "";
    if (signOutButton) signOutButton.hidden = !authenticated;
    if (loginLink) loginLink.hidden = authenticated;
  }

  function showDemoMode() {
    if (isLoginPage) {
      loginForm.hidden = true;
      resetForm.hidden = true;
      updateForm.hidden = true;
      title.textContent = "인증 설정이 필요합니다";
      intro.hidden = true;
      demoWarning.hidden = false;
      demoWarning.textContent = "Supabase 인증이 아직 설정되지 않아 계정 로그인을 사용할 수 없습니다. 데모 화면은 로그인 없이 이용할 수 있습니다.";
    } else {
      showNotice("데모 모드입니다. 실제 계정 인증은 Supabase 설정 후 사용할 수 있습니다.");
    }
  }

  if (!config.url || !config.anonKey) {
    showDemoMode();
    return;
  }

  if (!window.supabase?.createClient) {
    const text = "인증 라이브러리를 불러오지 못했습니다. 네트워크 연결을 확인하세요.";
    console.error(text);
    if (isLoginPage) setMessage(text, true);
    else showNotice(text);
    return;
  }

  if (!isLoginPage) {
    document.body.classList.add("auth-required");
  }

  const supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
    auth: { flowType: "pkce", detectSessionInUrl: true },
  });
  const recoveryLink = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
  let recovering = recoveryLink;

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    setBusy(loginForm, true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: form.get("email").trim(),
      password: form.get("password"),
    });
    setBusy(loginForm, false);
    if (error) {
      console.error("로그인하지 못했습니다.", error);
      setMessage("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.", true);
      return;
    }
    window.location.assign(getReturnTo());
  });

  resetForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = new FormData(resetForm).get("email").trim();
    setBusy(resetForm, true);
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: getLoginUrl(getReturnTo()).toString(),
    });
    setBusy(resetForm, false);
    if (error) {
      console.error("비밀번호 재설정 이메일을 보내지 못했습니다.", error);
      setMessage("재설정 이메일을 보내지 못했습니다. 이메일 주소와 인증 설정을 확인하세요.", true);
      return;
    }
    setMessage("비밀번호 재설정 링크를 이메일로 보냈습니다.");
  });

  updateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(updateForm);
    const password = form.get("password");
    if (password.length < 12 || password.length > 128) {
      setMessage("비밀번호는 12자 이상 128자 이하로 입력하세요.", true);
      return;
    }
    if (password !== form.get("confirmPassword")) {
      setMessage("비밀번호 확인 값이 일치하지 않습니다.", true);
      return;
    }
    setBusy(updateForm, true);
    const { error } = await supabaseClient.auth.updateUser({ password });
    setBusy(updateForm, false);
    if (error) {
      console.error("비밀번호를 변경할 수 없습니다.", error);
      setMessage("비밀번호를 변경할 수 없습니다. 보안 기준을 확인하고 다시 시도하세요.", true);
      return;
    }
    const { error: signOutError } = await supabaseClient.auth.signOut();
    if (signOutError) {
      console.error("비밀번호 변경 후 로그아웃하지 못했습니다.", signOutError);
      setMessage("비밀번호는 변경했지만 로그아웃하지 못했습니다. 새 비밀번호로 다시 로그인하세요.", true);
      return;
    }
    recovering = false;
    setView("login");
    setMessage("비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.");
  });

  document.querySelectorAll("[data-auth-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.authView));
  });

  signOutButton?.addEventListener("click", async () => {
    signOutButton.disabled = true;
    const { error } = await supabaseClient.auth.signOut();
    signOutButton.disabled = false;
    if (error) {
      console.error("로그아웃하지 못했습니다.", error);
      showNotice("로그아웃하지 못했습니다. 다시 시도하세요.");
      return;
    }
    window.location.assign(getLoginUrl("./index.html"));
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      recovering = true;
      if (isLoginPage) {
        setView("update");
        document.getElementById("newPassword").focus();
      }
      return;
    }
    if (isLoginPage) {
      if (session && !recovering && !(recoveryLink && event === "INITIAL_SESSION")) {
        window.location.replace(getReturnTo());
      } else if (event !== "INITIAL_SESSION" && !session) {
        setView("login");
      }
      return;
    }
    if (session) {
      document.body.classList.remove("auth-required");
      showNotice("로그인 인증이 연결되었습니다. 업무 데이터와 역할 권한은 아직 데모 기능입니다.", session.user.email, true);
      return;
    }
    if (event !== "INITIAL_SESSION") window.location.replace(getLoginUrl().toString());
  });

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("로그인 상태를 확인하지 못했습니다.", error);
      if (isLoginPage) setMessage("로그인 상태를 확인하지 못했습니다. 페이지를 새로고침하세요.", true);
      else window.location.replace(getLoginUrl().toString());
      return;
    }
    if (isLoginPage) {
      if (recovering) {
        setView("update");
        document.getElementById("newPassword").focus();
      } else if (data.session) {
        window.location.replace(getReturnTo());
      } else {
        document.getElementById("authEmail").focus();
      }
      return;
    }
    if (data.session) {
      document.body.classList.remove("auth-required");
      showNotice("로그인 인증이 연결되었습니다. 업무 데이터와 역할 권한은 아직 데모 기능입니다.", data.session.user.email, true);
    } else {
      window.location.replace(getLoginUrl().toString());
    }
  });
})();
