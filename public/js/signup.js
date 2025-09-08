document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const msg = document.getElementById('signupMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const body = {
      name: f.name.value,
      email: f.email.value,
      phone: f.phone.value,
      password: f.password.value
    };
    if (msg) msg.textContent = '...';

    try {
      const r = await api('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      setToken(r.token);
      if (msg) msg.textContent = 'Signup successful! Redirecting to notes...';
      setTimeout(() => { window.location.href = 'notes.html'; }, 1000);
    } catch (err) {
      if (msg) msg.textContent = err.message;
    }
  });
});
