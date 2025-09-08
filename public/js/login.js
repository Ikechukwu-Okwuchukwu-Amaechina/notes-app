document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('loginMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const body = { email: f.email.value, password: f.password.value };
    if (msg) msg.textContent = '...';
    try {
      const r = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
      setToken(r.token);
      window.location.href = 'notes.html';
    } catch (err) {
      if (msg) msg.textContent = err.message;
    }
  });
});
