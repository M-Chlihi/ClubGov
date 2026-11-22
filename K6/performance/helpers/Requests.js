import http from "k6/http";
import { check } from "k6";
import { BASE_URL, API_URL } from "../config/envirement.js";

export function getHealth() {
  return http.get(`${BASE_URL}/health`);
}

export function get(endpoint, token = null) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return http.get(`${API_URL}${endpoint}`, {
    headers,
  });
}

export function post(endpoint, body, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return http.post(`${API_URL}${endpoint}`, JSON.stringify(body), { headers });
}

export function checkSuccessfulResponse(response, name) {
  return check(response, {
    [`${name}: status 200`]: (r) => r.status === 200,
    [`${name}: response time acceptable`]: (r) => r.timings.duration < 1000,
  });
}
