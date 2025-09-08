document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verifyForm');
  const msg = document.getElementById('verifyMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const body = { email: f.email.value, otp: f.otp.value };
    if (msg) msg.textContent = '...';
    try {
      await api('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) });
      if (msg) msg.textContent = 'Verified! Now you can login.';
    } catch (err) {
      if (msg) msg.textContent = err.message;
    }
  });
});
