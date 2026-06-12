import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { claimsAPI } from '../api';
import './AdminPanel.css';

export default function AdminPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      // Fetch all claims across the system for the admin
      const res = await claimsAPI.getAllClaims();
      setClaims(res.data);
    } catch (err) {
      setError('Failed to load claims. Make sure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (claimId, status) => {
    setActionLoading(claimId);
    try {
      await claimsAPI.updateStatus(claimId, status);
      // Update local state
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${status.toLowerCase()} claim.`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredClaims = claims.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  if (loading) {
    return (
      <div className="loading-container page-content">
        <div className="loader"></div>
        <p>Loading claims...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="heading-2">Admin Panel</h1>
            <p className="text-secondary">Manage and review submitted claims</p>
          </div>
          <div className="admin-filters">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter(f)}
                id={`filter-${f.toLowerCase()}`}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error mb-lg">{error}</div>}

        {filteredClaims.length === 0 ? (
          <div className="empty-state">
            <div className="icon">⚖️</div>
            <h3>No claims to review</h3>
            <p>
              {filter !== 'ALL'
                ? `No ${filter.toLowerCase()} claims found.`
                : 'There are no claims in the system yet.'}
            </p>
          </div>
        ) : (
          <div className="admin-claims-list">
            {filteredClaims.map((claim, index) => (
              <div
                key={claim.id}
                className="admin-claim-card card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                id={`admin-claim-${claim.id}`}
              >
                <div className="admin-claim-content">
                  {/* Item Info */}
                  <div className="admin-claim-section">
                    <span className="section-label">Item</span>
                    <Link
                      to={`/items/${claim.item?.id}`}
                      className="admin-item-title"
                    >
                      {claim.item?.title || 'Unknown Item'}
                    </Link>
                    <div className="flex gap-sm mt-sm">
                      <span className={`badge badge-${claim.item?.type?.toLowerCase()}`}>
                        {claim.item?.type}
                      </span>
                      <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {claim.item?.category}
                      </span>
                    </div>
                  </div>

                  {/* Claimer Info */}
                  <div className="admin-claim-section">
                    <span className="section-label">Claimed By</span>
                    <span className="admin-claimer-name">
                      {claim.claimer?.username || 'Unknown'}
                    </span>
                    <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {claim.claimer?.email}
                    </span>
                  </div>

                  {/* Proof */}
                  <div className="admin-claim-section admin-claim-proof">
                    <span className="section-label">Proof of Ownership</span>
                    <p className="admin-proof-text">{claim.proofOfOwnership}</p>
                  </div>

                  {/* Status & Actions */}
                  <div className="admin-claim-actions">
                    <span className={`badge badge-${claim.status?.toLowerCase()}`}>
                      {claim.status}
                    </span>
                    <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {formatDate(claim.createdAt)}
                    </span>

                    {claim.status === 'PENDING' && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-found btn-sm"
                          onClick={() => handleStatusUpdate(claim.id, 'APPROVED')}
                          disabled={actionLoading === claim.id}
                          id={`approve-${claim.id}`}
                        >
                          {actionLoading === claim.id ? '...' : '✓ Approve'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusUpdate(claim.id, 'REJECTED')}
                          disabled={actionLoading === claim.id}
                          id={`reject-${claim.id}`}
                        >
                          {actionLoading === claim.id ? '...' : '✕ Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
