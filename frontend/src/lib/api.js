const API = `${import.meta.env.VITE_API_URL || ''}/api`;

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (includeAuth && token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function handleRes(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || 'Request failed');
  return data;
}

export const authApi = {
  login: (email, password) => fetch(`${API}/auth/login`, { method: 'POST', headers: getHeaders(false), body: JSON.stringify({ email, password }) }).then(handleRes),
  register: (body) => fetch(`${API}/auth/register`, { method: 'POST', headers: getHeaders(false), body: JSON.stringify(body) }).then(handleRes),
  me: () => fetch(`${API}/auth/me`, { headers: getHeaders() }).then(handleRes),
};

export const wtpApi = {
  list: () => fetch(`${API}/wtp`, { headers: getHeaders() }).then(handleRes),
  get: (id) => fetch(`${API}/wtp/${id}`, { headers: getHeaders() }).then(handleRes),
  create: (body) => fetch(`${API}/wtp`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleRes),
  update: (id, body) => fetch(`${API}/wtp/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body) }).then(handleRes),
  delete: (id) => fetch(`${API}/wtp/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleRes),
};

export const userApi = {
  profile: () => fetch(`${API}/user/profile`, { headers: getHeaders() }).then(handleRes),
  updateProfile: (body) => fetch(`${API}/user/profile`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body) }).then(handleRes),
};

export const adminApi = {
  users: () => fetch(`${API}/admin/users`, { headers: getHeaders() }).then(handleRes),
  designs: () => fetch(`${API}/admin/designs`, { headers: getHeaders() }).then(handleRes),
  analytics: () => fetch(`${API}/admin/analytics`, { headers: getHeaders() }).then(handleRes),
  deleteUser: (id) => fetch(`${API}/admin/users/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleRes),
  deleteDesign: (id) => fetch(`${API}/admin/designs/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleRes),
};
