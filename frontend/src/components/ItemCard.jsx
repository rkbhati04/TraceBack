import { Link } from 'react-router-dom';
import './ItemCard.css';

export default function ItemCard({ item }) {
  const isLost = item.type === 'LOST';
  const typeClass = isLost ? 'lost' : 'found';

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
    return url;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCategory = (cat) => {
    if (!cat) return '';
    return cat.charAt(0) + cat.slice(1).toLowerCase();
  };

  return (
    <Link to={`/items/${item.id}`} className={`item-card card ${typeClass}`} id={`item-card-${item.id}`}>
      <div className={`item-card-accent ${typeClass}`}></div>
      <div className="item-card-header">
        <span className={`badge badge-${typeClass}`}>{item.type}</span>
        <span className={`badge badge-${item.status?.toLowerCase()}`}>
          {item.status}
        </span>
      </div>
      {item.imageUrl && (
        <div className="item-card-image">
          <img src={getImageUrl(item.imageUrl)} alt={item.title} />
        </div>
      )}
      <div className="item-card-body">
        <h3 className="item-card-title">{item.title}</h3>
        <span className="item-card-category">{formatCategory(item.category)}</span>
        <div className="item-card-meta">
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{item.location}</span>
          </div>
          <div className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{formatDate(item.dateOccurred)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
