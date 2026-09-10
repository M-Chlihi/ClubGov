import { useState } from "react";

import Input from "../../../components/ui/input";
import Button from "../../../components/ui/Button";

export default function RegisterForm({
  onSubmit,
  submitting = false,
  error = "",
}) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = form.username.trim();
    const errors = {};

    if (!username) {
      errors.username = "Username is required.";
    } else if (EMAIL_REGEX.test(username)) {
      errors.username = "Username cannot be an email address.";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    } else if (!USERNAME_REGEX.test(username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores.";
    }

    const email = form.email.trim();
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      errors.password =
        "Password must include an uppercase letter and a number.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    await onSubmit({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <Input
        id="register-username"
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        autoComplete="username"
        placeholder="Choose a username"
        error={fieldErrors.username}
        disabled={submitting}
      />

      <Input
        id="register-email"
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        placeholder="you@example.com"
        error={fieldErrors.email}
        disabled={submitting}
      />
      <div className="relative">
        <Input
          id="register-password"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="Create a password"
          error={fieldErrors.password}
          disabled={submitting}
        />
      </div>
      <Input
        id="register-confirm-password"
        label="Confirm password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        placeholder="Repeat your password"
        error={fieldErrors.confirmPassword}
        disabled={submitting}
      />

      <Button type="submit" fullWidth size="lg" loading={submitting}>
        Create account
      </Button>
    </form>
  );
}
