import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import './Dashboard.css';

const CATEGORIES = ['ALL', 'ELECTRONICS', 'DOCUMENTS', 'WALLET', 'KEYS', 'CLOTHING', 'BOOKS', 'OTHER'];
const TYPES = ['ALL', 'LOST', 'FOUND'];

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await itemsAPI.getAll();
      setItems(res.data);
    } catch (err) {
      setError('Failed to load items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search, category, and type
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === 'ALL' || item.category === filterCategory;

    const matchesType = filterType === 'ALL' || item.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Stats
  const totalLost = items.filter((i) => i.type === 'LOST').length;
  const totalFound = items.filter((i) => i.type === 'FOUND').length;
  const totalResolved = items.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="page-content">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in-up">
            <h1 className="hero-title">
              Find What's Lost.
              <br />
              <span className="hero-highlight">Return What's Found.</span>
            </h1>
            <p className="hero-subtitle">
              A community-powered platform to report and reclaim lost items. 
              Post what you've lost or found and help reconnect people with their belongings.
            </p>
            {isAuthenticated && (
              <Link to="/post-item" className="btn btn-primary btn-lg" id="hero-post-btn">
                + Report an Item
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-number">{totalLost}</span>
              <span className="stat-label">Lost Items</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalFound}</span>
              <span className="stat-label">Found Items</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalResolved}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="container mt-2xl">
        <div className="filters-bar" id="filters-bar">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search items by title, description, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input"
            />
          </div>
          <div className="filter-selects">
            <select
              className="form-input filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              id="filter-category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <select
              className="form-input filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              id="filter-type"
            >
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="container mt-lg">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading items...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No items found</h3>
            <p>
              {search || filterCategory !== 'ALL' || filterType !== 'ALL'
                ? 'Try adjusting your filters or search query.'
                : 'Be the first to report a lost or found item!'}
            </p>
          </div>
        ) : (
          <>
            <p className="results-count text-muted" style={{ marginBottom: 'var(--space-md)' }}>
              Showing {filteredItems.length} of {items.length} items
            </p>
            <div className="items-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
