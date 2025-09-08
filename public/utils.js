let token = localStorage.getItem('token') || '';

function setToken(t){
  token = t;
  localStorage.setItem('token', t);
}

async function api(path, opts={}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers||{}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(path, { ...opts, headers });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}
