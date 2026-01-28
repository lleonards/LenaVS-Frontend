import api from './axios';

// =====================
// 🔐 AUTH
// =====================
export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verify: () => api.get('/api/auth/verify')
};

// =====================
// ⬆️ UPLOAD
// =====================
export const uploadService = {
  audio: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // original | instrumental

    return api.post('/api/upload/audio', formData);
  },

  media: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // video | image

    return api.post('/api/upload/media', formData);
  },

  lyricsFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/api/upload/lyrics', formData);
  },

  lyricsText: (text) =>
    api.post('/api/upload/lyrics/text', { text })
};

// =====================
// 📁 PROJECTS
// =====================
export const projectService = {
  create: (data) => api.post('/api/projects', data),
  getAll: () => api.get('/api/projects'),
  getById: (id) => api.get(`/api/projects/${id}`),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
  setVisibility: (id, isPublic) =>
    api.patch(`/api/projects/${id}/visibility`, { isPublic }),
  getPublic: () => api.get('/api/projects/public/library'),
  clone: (id) => api.post(`/api/projects/clone/${id}`)
};

// =====================
// 🎬 EXPORT
// =====================
export const exportService = {
  video: (data) => api.post('/api/export/video', data),
  getStatus: (jobId) => api.get(`/api/export/status/${jobId}`)
};

// =====================
// 🐞 REPORT
// =====================
export const reportService = {
  error: (data) => api.post('/api/report/error', data)
};
