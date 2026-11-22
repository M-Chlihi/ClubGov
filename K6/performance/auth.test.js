import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3500";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 30 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  // 1. Login
  const loginResponse = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: __ENV.TEST_EMAIL,
      password: __ENV.TEST_PASSWORD,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  check(loginResponse, {
    "login successful": (r) => r.status === 200,
  });

  if (loginResponse.status !== 200) {
    return;
  }

  // 2. Extract access token
  const token = loginResponse.json("accessToken");

  check(token, {
    "access token received": (t) => !!t,
  });

  if (!token) {
    return;
  }

  // 3. Access protected endpoint
  const profileResponse = http.get(`${BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  check(profileResponse, {
    "profile retrieved": (r) => r.status === 200,
  });

  sleep(1);
}
