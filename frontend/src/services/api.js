const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function api(path, opts = {}) {
  const isFormData = opts.body instanceof FormData;
  const { headers: extraHeaders, ...restOpts } = opts;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...restOpts,
    headers: isFormData
      ? extraHeaders
      : { 'Content-Type': 'application/json', ...extraHeaders },
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
  return data;
}

export const notebooks = {
  list: () => api('/notebooks'),
  get: (id) => api(`/notebooks/${id}`),
  create: (d) => api('/notebooks', { method: 'POST', body: JSON.stringify(d) }),
  update: (id, d) => api(`/notebooks/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  delete: (id) => api(`/notebooks/${id}`, { method: 'DELETE' }),
};

export const categories = {
  list: () => api('/categories'),
  create: (d) => api('/categories', { method: 'POST', body: JSON.stringify(d) }),
  update: (id, d) => api(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  delete: (id) => api(`/categories/${id}`, { method: 'DELETE' }),
};

export const uploads = {
  create: (notebookId, file) => {
    const form = new FormData();
    form.append('notebookId', String(notebookId));
    form.append('file', file);
    return api('/uploads', { method: 'POST', body: form });
  },
  remove: (id) => api(`/uploads/${id}`, { method: 'DELETE' }),
};
