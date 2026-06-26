const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Standard request helper
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Resolve headers. If uploading files (using FormData), omit default Content-Type so browser configures boundaries.
  const headers = options.body instanceof FormData 
    ? { ...getHeaders() } 
    : { ...getHeaders(), ...options.headers };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle standard HTTP status errors before JSON parsing to catch server failures
  if (response.status === 204) return { success: true };

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Connection error. Server returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};

export const api = {
  // Public Catalog Endpoints
  getPackages: () => request('/packages'),
  getPackage: (slug) => request(`/packages/${slug}`),
  getVehicles: () => request('/vehicles'),
  getVehicle: (slug) => request(`/vehicles/${slug}`),
  getTestimonials: () => request('/testimonials'),
  submitInquiry: (data) => request('/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Authentication Endpoints
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getMe: () => request('/auth/me'),

  // Admin Packages CRUD
  getAdminPackages: (search = '', page = 1, limit = 10) => 
    request(`/packages/admin?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`),
  createPackage: (formData) => request('/packages', {
    method: 'POST',
    body: formData,
  }),
  updatePackage: (id, formData) => request(`/packages/${id}`, {
    method: 'PUT',
    body: formData,
  }),
  deletePackage: (id) => request(`/packages/${id}`, {
    method: 'DELETE',
  }),

  // Admin Fleet CRUD
  getAdminVehicles: (search = '', page = 1, limit = 10) => 
    request(`/vehicles/admin?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`),
  createVehicle: (formData) => request('/vehicles', {
    method: 'POST',
    body: formData,
  }),
  updateVehicle: (id, formData) => request(`/vehicles/${id}`, {
    method: 'PUT',
    body: formData,
  }),
  deleteVehicle: (id) => request(`/vehicles/${id}`, {
    method: 'DELETE',
  }),

  // Admin Testimonials CRUD
  getAdminTestimonials: (search = '', page = 1, limit = 10) => 
    request(`/testimonials?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`),
  createTestimonial: (data) => request('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTestimonial: (id, data) => request(`/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTestimonial: (id) => request(`/testimonials/${id}`, {
    method: 'DELETE',
  }),

  // Admin Booking Inquiries
  getAdminInquiries: (search = '', status = 'All', page = 1, limit = 10) => 
    request(`/inquiries?search=${encodeURIComponent(search)}&status=${status}&page=${page}&limit=${limit}`),
  updateInquiryStatus: (id, data) => request(`/inquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteInquiry: (id) => request(`/inquiries/${id}`, {
    method: 'DELETE',
  }),

  // Super Admin Admin Users Management
  getAdmins: (search = '', page = 1, limit = 10) => 
    request(`/admins?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`),
  createAdmin: (data) => request('/admins', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteAdmin: (id) => request(`/admins/${id}`, {
    method: 'DELETE',
  }),
};
