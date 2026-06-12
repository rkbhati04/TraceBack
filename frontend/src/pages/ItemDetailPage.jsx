import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsAPI, claimsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import './ItemDetail.css';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim form state
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimProof, setClaimProof] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await itemsAPI.getById(id);
      setItem(res.data);
    } catch (err) {
      setError('Item not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!claimProof.trim()) {
      setClaimError('Please provide proof of ownership.');
      return;
    }

    setClaimLoading(true);
    setClaimError('');
    try {
      await claimsAPI.submit(id, { proofOfOwnership: claimProof });
      setClaimSuccess('Claim submitted successfully! You can track it in My Claims.');
      setShowClaimForm(false);
      setClaimProof('');
    } catch (err) {
      setClaimError(
        err.response?.data?.message || 'Failed to submit claim. Please try again.'
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await itemsAPI.delete(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCategory = (cat) => {
    if (!cat) return '';
    return cat.charAt(0) + cat.slice(1).toLowerCase();
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
    return url;
  };

  if (loading) {
    return (
      <div className="loading-container page-content">
        <div className="loader"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content container">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-outline mt-md">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!item) return null;

  const isLost = item.type === 'LOST';
  const typeClass = isLost ? 'lost' : 'found';
  const isOwner = user?.username === item.reporter?.username;
  const canDelete = isOwner || isAdmin;
  const canClaim =
    isAuthenticated &&
    !isOwner &&
    item.type === 'FOUND' &&
    item.status === 'ACTIVE';

  return (
    <div className="page-content">
      <div className="container">
        <Link to="/" className="back-link" id="back-to-dashboard">
          ← Back to Browse
        </Link>

        <div className="item-detail animate-fade-in-up">
          <div className="item-detail-main">
            {/* Image */}
            {item.imageUrl && (
              <div className="detail-image">
                <img src={getImageUrl(item.imageUrl)} alt={item.title} />
              </div>
            )}

            {/* Content */}
            <div className="detail-content">
              <div className="detail-badges">
                <span className={`badge badge-${typeClass}`}>{item.type}</span>
                <span className={`badge badge-${item.status?.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>

              <h1 className="detail-title">{item.title}</h1>
              <p className="detail-category">{formatCategory(item.category)}</p>
              <p className="detail-description">{item.description}</p>

              <div className="detail-meta-grid">
                <div className="detail-meta-item">
                  <span className="meta-label">Location</span>
                  <span className="meta-value">{item.location}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-label">Date Occurred</span>
                  <span className="meta-value">{formatDate(item.dateOccurred)}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-label">Posted</span>
                  <span className="meta-value">{formatDate(item.createdAt)}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-label">Reported By</span>
                  <span className="meta-value">{item.reporter?.username || 'Unknown'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="detail-actions">
                {canClaim && !claimSuccess && (
                  <button
                    className="btn btn-found btn-lg"
                    onClick={() => setShowClaimForm(!showClaimForm)}
                    id="btn-submit-claim"
                  >
                    {showClaimForm ? 'Cancel' : '🙋 Claim This Item'}
                  </button>
                )}

                {canDelete && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    id="btn-delete-item"
                  >
                    Delete Item
                  </button>
                )}
              </div>

              {/* Success Message */}
              {claimSuccess && (
                <div className="alert alert-success mt-md">{claimSuccess}</div>
              )}

              {/* Claim Form */}
              {showClaimForm && (
                <form
                  onSubmit={handleSubmitClaim}
                  className="claim-form animate-fade-in-up"
                  id="claim-form"
                >
                  <h3>Submit Your Claim</h3>
                  <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                    Please describe why you believe this item belongs to you. Include any identifying details.
                  </p>
                  {claimError && (
                    <div className="alert alert-error mb-md">{claimError}</div>
                  )}
                  <div className="form-group">
                    <label className="form-label" htmlFor="proof-of-ownership">
                      Proof of Ownership
                    </label>
                    <textarea
                      className="form-input"
                      id="proof-of-ownership"
                      value={claimProof}
                      onChange={(e) => setClaimProof(e.target.value)}
                      placeholder="Describe the item in detail — color, brand, unique marks, contents, etc."
                      rows={4}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-found"
                    disabled={claimLoading}
                    id="btn-confirm-claim"
                  >
                    {claimLoading ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
