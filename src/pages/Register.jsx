import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  organization: '',
  role: 'data-user',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (form.password.trim() && form.password.trim().length < 4)
      newErrors.password = 'Password must be at least 4 characters';
    if (!form.organization.trim())
      newErrors.organization = 'Organization is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      organization: form.organization.trim(),
      role: form.role,
      membershipTier: 'public',
    });
    navigate('/dashboard');
  };

  const fieldClass = (field) =>
    `block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
        : 'border-gray-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
    }`;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join the Health Data Innovation Platform
          </p>
        </div>

        {/* Registration form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 space-y-5"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={fieldClass('name')}
              placeholder="Dr. Jane Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="reg-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={fieldClass('email')}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              className={fieldClass('password')}
              placeholder="At least 4 characters"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Organization */}
          <div>
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Organization
            </label>
            <input
              id="organization"
              type="text"
              value={form.organization}
              onChange={(e) => update('organization', e.target.value)}
              className={fieldClass('organization')}
              placeholder="University or company name"
            />
            {errors.organization && (
              <p className="mt-1 text-xs text-red-600">{errors.organization}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="data-user">Data User</option>
              <option value="data-holder">Data Holder</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-teal-600 hover:text-teal-700"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
