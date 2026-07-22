const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Multipart file upload helper built on XHR rather than fetch — fetch has no
// upload progress event, and onProgress needs the real bytes-sent count to
// drive an actual progress bar. Mirrors each service's fetch-based request()
// wrapper: same { success, data, message } normalization and thrown-error
// shape, so callers handle failures identically either way.
export function uploadRequest(path, formData, { method = 'POST', onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_BASE_URL}${path}`);
    xhr.withCredentials = true; // send the httpOnly auth cookie, same as credentials: 'include'

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let body = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = null;
      }

      if (xhr.status < 200 || xhr.status >= 300 || !body?.success) {
        const error = new Error(body?.message || 'Something went wrong. Please try again.');
        error.fieldErrors = body?.data?.errors || null;
        error.status = xhr.status;
        reject(error);
        return;
      }

      resolve(body.data);
    };

    xhr.onerror = () => reject(new Error('Network error. Please try again.'));

    xhr.send(formData);
  });
}
