import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' },
      });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        // Backend returns field-level validation errors like { errors: { username: "msg", email: "msg" } }
        const fieldMessages = Object.entries(data.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join('. ');
        setError(fieldMessages);
      } else {
        setError(
          data?.message ||
            'Registration failed. Username or email may already be taken.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in-up">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <span className="brand-icon">◈</span>
            TraceBack
          </Link>
          <h1>Create an account</h1>
          <p className="text-secondary">
            Join TraceBack to report and reclaim items
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">
              Username <span className="required">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              id="reg-username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Email <span className="required">*</span>
            </label>
            <input
              className="form-input"
              type="email"
              id="reg-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password <span className="required">*</span>
            </label>
            <input
              className="form-input"
              type="password"
              id="reg-password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">
              Phone Number
            </label>
            <input
              className="form-input"
              type="tel"
              id="reg-phone"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            id="btn-submit-register"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
