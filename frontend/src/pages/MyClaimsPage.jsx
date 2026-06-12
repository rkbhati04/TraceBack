import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { claimsAPI } from '../api';
import './MyClaims.css';

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await claimsAPI.getMyClaims();
      setClaims(res.data);
    } catch (err) {
      setError('Failed to load your claims.');
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      default: return '●';
    }
  };

  if (loading) {
    return (
      <div className="loading-container page-content">
        <div className="loader"></div>
        <p>Loading your claims...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="claims-header">
          <h1 className="heading-2">My Claims</h1>
          <p className="text-secondary">Track the status of your submitted claims</p>
        </div>

        {error && <div className="alert alert-error mb-lg">{error}</div>}

        {claims.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No claims yet</h3>
            <p>
              When you submit a claim on a found item, it will appear here.
            </p>
            <Link to="/" className="btn btn-primary mt-lg">
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="claims-list">
            {claims.map((claim, index) => (
              <div
                key={claim.id}
                className="claim-card card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                id={`claim-card-${claim.id}`}
              >
                <div className="claim-card-content">
                  <div className="claim-item-info">
                    <Link
                      to={`/items/${claim.item?.id}`}
                      className="claim-item-title"
                    >
                      {claim.item?.title || 'Unknown Item'}
                    </Link>
                    <div className="claim-item-meta">
                      <span className={`badge badge-${claim.item?.type?.toLowerCase()}`}>
                        {claim.item?.type}
                      </span>
                      <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {claim.item?.location}
                      </span>
                    </div>
                  </div>

                  <div className="claim-details">
                    <div className="claim-proof">
                      <span className="meta-label">Your Proof</span>
                      <p className="proof-text">{claim.proofOfOwnership}</p>
                    </div>
                    <div className="claim-submitted">
                      <span className="meta-label">Submitted</span>
                      <span className="meta-value">{formatDate(claim.createdAt)}</span>
                    </div>
                  </div>

                  <div className="claim-status-section">
                    <span className={`claim-status-badge badge badge-${claim.status?.toLowerCase()}`}>
                      {getStatusIcon(claim.status)} {claim.status}
                    </span>
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
