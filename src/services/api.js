// src/services/api.js
// Central API layer — all calls to the Express/MongoDB backend go through here.

const BASE = 'http://localhost:5000/api';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const get   = (path)       => request('GET',    path);
const post  = (path, body) => request('POST',   path, body);
const put   = (path, body) => request('PUT',    path, body);
const patch = (path, body) => request('PATCH',  path, body);
const del   = (path, body) => request('DELETE', path, body);

// ── Faculty ──────────────────────────────────────────────────────────────────
export const facultyAPI = {
  getAll:  ()         => get('/faculty'),
  getOne:  (id)       => get(`/faculty/${id}`),
  create:  (data)     => post('/faculty', data),
  update:  (id, data) => put(`/faculty/${id}`, data),
  remove:  (id)       => del(`/faculty/${id}`),
};

// ── Profile ──────────────────────────────────────────────────────────────────
export const profileAPI = {
  get:          (facultyId)         => get(`/profile/${facultyId}`),
  save:         (facultyId, data)   => post(`/profile/${facultyId}`, data),
  patch:        (facultyId, data)   => patch(`/profile/${facultyId}`, data),
  updateStatus: (facultyId, status) => patch(`/profile/${facultyId}/status`, { status }),
};

// ── Submissions ──────────────────────────────────────────────────────────────
export const submissionsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/submissions${qs ? '?' + qs : ''}`);
  },
  getOne:    (id)                              => get(`/submissions/${id}`),
  create:    (data)                            => post('/submissions', data),
  setStatus: (id, status, comment, reviewedBy) =>
    patch(`/submissions/${id}/status`, { status, comment, reviewedBy }),
  supersede: (id)  => patch(`/submissions/${id}/supersede`, {}),
  remove:    (id)  => del(`/submissions/${id}`),
};

// ── Events / MoUs / News ─────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/events${qs ? '?' + qs : ''}`);
  },
  getOne:  (id)       => get(`/events/${id}`),
  create:  (data)     => post('/events', data),
  update:  (id, data) => put(`/events/${id}`, data),
  remove:  (id)       => del(`/events/${id}`),
};

// ── Trending ─────────────────────────────────────────────────────────────────
export const trendingAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/trending${qs ? '?' + qs : ''}`);
  },
  getOne:  (id)       => get(`/trending/${id}`),
  create:  (data)     => post('/trending', data),
  update:  (id, data) => put(`/trending/${id}`, data),
  remove:  (id)       => del(`/trending/${id}`),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll:   (userId) => get(`/notifications?userId=${userId}`),
  create:   (data)   => post('/notifications', data),
  markOne:  (id)     => patch(`/notifications/${id}/read`, {}),
  markAll:  (userId) => patch('/notifications/mark-all-read', { userId }),
  clearAll: (userId) => del('/notifications/clear', { userId }),
};
