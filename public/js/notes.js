document.addEventListener('DOMContentLoaded', () => {
  if (!token) { window.location.href = 'login.html'; return; }

  const list = document.getElementById('notesList');
  const refreshBtn = document.getElementById('refreshBtn');
  const form = document.getElementById('createNoteForm');
  const createMsg = document.getElementById('createMsg');

  async function refreshNotes() {
    if (list) list.textContent = 'Loading...';
    const single = (document.getElementById('singleTag')?.value || '').trim();
    const multi = (document.getElementById('multiTags')?.value || '').trim();
    const params = new URLSearchParams();
    if (single) params.set('tag', single);
    if (multi) params.set('tags', multi);
    try {
      const r = await api('/api/notes' + (params.toString() ? ('?' + params.toString()) : ''));
      if (list) {
        list.innerHTML = (r.notes || []).map(n =>
          `<div class="note"><strong>${n.title}</strong><br>${n.content}<br><em>${(n.tags||[]).join(', ')}</em></div>`
        ).join('') || 'No notes.';
      }
    } catch (err) {
      if (list) list.textContent = err.message;
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', refreshNotes);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const tags = (f.tags.value || '').split(',').map(s => s.trim()).filter(Boolean);
      const body = { title: f.title.value, content: f.content.value, tags };
      if (createMsg) createMsg.textContent = '...';
      try {
        await api('/api/notes', { method: 'POST', body: JSON.stringify(body) });
        if (createMsg) createMsg.textContent = 'Note created!';
        f.reset();
        refreshNotes();
      } catch (err) {
        if (createMsg) createMsg.textContent = err.message;
      }
    });
  }

  refreshNotes();
});
