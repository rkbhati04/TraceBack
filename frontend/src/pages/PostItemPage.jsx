import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { itemsAPI, uploadAPI } from '../api';
import './PostItem.css';

const CATEGORIES = ['ELECTRONICS', 'DOCUMENTS', 'WALLET', 'KEYS', 'CLOTHING', 'BOOKS', 'OTHER'];

export default function PostItemPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'LOST',
    category: 'ELECTRONICS',
    location: '',
    dateOccurred: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: 'Please select an image file (JPG, PNG, etc.)' });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image must be under 5MB' });
      return;
    }

    setImageFile(file);
    setErrors({ ...errors, image: '' });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.dateOccurred) newErrors.dateOccurred = 'Date is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      let imageUrl = null;

      // Upload image first if one was selected
      if (imageFile) {
        setUploadProgress('Uploading image...');
        const uploadRes = await uploadAPI.uploadImage(imageFile);
        imageUrl = uploadRes.data.url;
      }

      // Submit the item
      setUploadProgress('Posting item...');
      const payload = {
        ...form,
        imageUrl: imageUrl,
      };
      await itemsAPI.create(payload);
      navigate('/');
    } catch (err) {
      console.error('Post item error:', err.response?.data || err);
      const data = err.response?.data;
      if (data?.errors) {
        const fieldMessages = Object.entries(data.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join('. ');
        setApiError(fieldMessages);
      } else {
        setApiError(
          data?.message || data?.error || `Failed to post item (${err.response?.status || 'network error'}). Please try again.`
        );
      }
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <Link to="/" className="back-link">← Back to Browse</Link>

        <div className="post-item-container animate-fade-in-up">
          <div className="post-item-header">
            <h1 className="heading-2">Report an Item</h1>
            <p className="text-secondary">
              Provide details about the item you've lost or found.
            </p>
          </div>

          {apiError && <div className="alert alert-error mb-lg">{apiError}</div>}

          <form onSubmit={handleSubmit} id="post-item-form">
            {/* Type Selection */}
            <div className="type-selector">
              <button
                type="button"
                className={`type-btn ${form.type === 'LOST' ? 'active lost' : ''}`}
                onClick={() => setForm({ ...form, type: 'LOST' })}
                id="type-lost"
              >
                <span className="type-icon">🔍</span>
                <span className="type-label">I Lost Something</span>
              </button>
              <button
                type="button"
                className={`type-btn ${form.type === 'FOUND' ? 'active found' : ''}`}
                onClick={() => setForm({ ...form, type: 'FOUND' })}
                id="type-found"
              >
                <span className="type-icon">📦</span>
                <span className="type-label">I Found Something</span>
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="post-title">
                  Title <span className="required">*</span>
                </label>
                <input
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  type="text"
                  id="post-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Blue iPhone 15 Pro"
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="post-category">
                  Category <span className="required">*</span>
                </label>
                <select
                  className="form-input"
                  id="post-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="post-description">
                Description <span className="required">*</span>
              </label>
              <textarea
                className={`form-input ${errors.description ? 'error' : ''}`}
                id="post-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed description — color, brand, distinguishing features..."
                rows={4}
              />
              {errors.description && (
                <span className="form-error">{errors.description}</span>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="post-location">
                  Location <span className="required">*</span>
                </label>
                <input
                  className={`form-input ${errors.location ? 'error' : ''}`}
                  type="text"
                  id="post-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., Central Library, 2nd Floor"
                />
                {errors.location && (
                  <span className="form-error">{errors.location}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="post-date">
                  Date Occurred <span className="required">*</span>
                </label>
                <input
                  className={`form-input ${errors.dateOccurred ? 'error' : ''}`}
                  type="date"
                  id="post-date"
                  name="dateOccurred"
                  value={form.dateOccurred}
                  onChange={handleChange}
                />
                {errors.dateOccurred && (
                  <span className="form-error">{errors.dateOccurred}</span>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">
                Photo <span className="text-muted">(optional)</span>
              </label>

              {!imagePreview ? (
                <div
                  className="image-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  id="image-upload-area"
                >
                  <div className="upload-icon">📷</div>
                  <p className="upload-text">Click to upload an image</p>
                  <p className="upload-hint">JPG, PNG or WebP — max 5MB</p>
                </div>
              ) : (
                <div className="image-preview-area">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger image-remove-btn"
                    onClick={removeImage}
                    id="btn-remove-image"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="post-image-input"
              />
              {errors.image && <span className="form-error">{errors.image}</span>}
            </div>

            <button
              type="submit"
              className={`btn btn-lg post-submit ${form.type === 'LOST' ? 'btn-lost' : 'btn-found'}`}
              disabled={loading}
              id="btn-submit-item"
            >
              {loading ? uploadProgress || 'Posting...' : `Post ${form.type} Item`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
