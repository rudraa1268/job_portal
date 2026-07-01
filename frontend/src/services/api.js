import api, { initCsrf } from './axios';

export const authService = {
  async init() {
    await initCsrf();
  },

  async register(data) {
    await initCsrf();
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  async login(credentials) {
    await initCsrf();
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  async logout() {
    await initCsrf();
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

export const employerService = {
  getDashboard() {
    return api.get('/employer/dashboard/').then((r) => r.data);
  },

  getCompanies() {
    return api.get('/employer/companies/').then((r) => r.data);
  },

  getMyJobs() {
    return api.get('/employer/jobs/').then((r) => r.data);
  },

  getJob(id) {
    return api.get(`/employer/jobs/${id}/`).then((r) => r.data);
  },

  createJob(data) {
    return api.post('/employer/jobs/', data).then((r) => r.data);
  },

  updateJob(id, data) {
    return api.put(`/employer/jobs/${id}/`, data).then((r) => r.data);
  },

  deleteJob(id) {
    return api.delete(`/employer/jobs/${id}/`).then((r) => r.data);
  },

  getApplicants(jobId) {
    return api.get(`/employer/jobs/${jobId}/applicants/`).then((r) => r.data);
  },

  updateApplicationStatus(applicationId, status) {
    return api.patch(`/employer/applications/${applicationId}/status/`, { status }).then((r) => r.data);
  },
};

export const jobService = {
  getJobs() {
    return api.get('/jobs/').then((r) => r.data);
  },

  getJob(id) {
    return api.get(`/jobs/${id}/`).then((r) => r.data);
  },

  apply(jobId, coverLetter) {
    return api.post(`/jobs/${jobId}/apply/`, { cover_letter: coverLetter }).then((r) => r.data);
  },
};

export const applicationService = {
  getMyApplications() {
    return api.get('/applications/my/').then((r) => r.data);
  },

  getJobSeekerDashboard() {
    return api.get('/jobseeker/dashboard/').then((r) => r.data);
  },
};

export function parseApiError(error) {
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (typeof errors === 'string') return errors;
    if (errors.non_field_errors) return errors.non_field_errors[0];
    const firstKey = Object.keys(errors)[0];
    const val = errors[firstKey];
    return typeof val === 'string' ? val : val[0] || val[Object.keys(val)[0]];
  }
  return error.response?.data?.error || error.message || 'Something went wrong';
}
