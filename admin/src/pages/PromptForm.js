import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './PromptForm.css';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const AI_MODELS = ['Any', 'ChatGPT', 'Claude', 'Gemini', 'GPT-4', 'Llama'];

const EMPTY = {
  title: '', content: '', description: '', category: '',
  tags: '', difficulty: 'beginner', aiModel: 'Any',
  isActive: true, isFeatured: false, author: 'PromptCraftery Team', resultImage: null
};

export default function PromptForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { api } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load categories
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/admin/categories').then(r => r.data.categories)
  });

  // Load existing prompt if editing
  const { data: existingPrompt } = useQuery({
    queryKey: ['prompt-edit', id],
    queryFn: () => api.get(`/admin/prompts?limit=1`).then(() =>
      api.get('/prompts').then(() => null)
    ),
    enabled: false
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/prompts`, { params: { limit: 200 } })
        .then(r => {
          const found = r.data.prompts.find(p => p._id === id);
          if (found) {
            setForm({
              title: found.title || '',
              content: found.content || '',
              description: found.description || '',
              category: found.category?._id || found.category || '',
              tags: (found.tags || []).join(', '),
              difficulty: found.difficulty || 'beginner',
              aiModel: found.aiModel || 'Any',
              isActive: found.isActive !== false,
              isFeatured: !!found.isFeatured,
              author: found.author || 'PromptCraftery Team',
              resultImage: found.resultImage || null
            });
            if (found.resultImage) {
              setImagePreview(found.resultImage);
            }
          }
        })
        .catch(() => toast.error('Failed to load prompt'));
    }
  }, [isEdit, id]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast.error('Only image files are allowed (JPEG, PNG, GIF, WebP)');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile || !id) {
      if (!id) toast.error('Please save the prompt first before uploading an image');
      return;
    }
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('resultImage', imageFile);
      
      const response = await api.post(`/prompts/${id}/upload-image`, formData);
      
      setForm(prev => ({ ...prev, resultImage: response.data.imageUrl }));
      setImageFile(null);
      setImagePreview(response.data.imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Image upload failed';
      toast.error(errorMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.category) {
      toast.error('Title, content, and category are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      };
      if (isEdit) {
        await api.put(`/prompts/${id}`, payload);
        toast.success('Prompt updated!');
      } else {
        await api.post('/prompts', payload);
        toast.success('Prompt created!');
      }
      queryClient.invalidateQueries(['admin-prompts']);
      queryClient.invalidateQueries(['admin-stats']);
      navigate('/prompts');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const charCount = form.content.length;

  return (
    <div className="prompt-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Prompt' : 'New Prompt'}</h1>
          <p className="page-sub">{isEdit ? 'Update existing prompt' : 'Add a new prompt to the library'}</p>
        </div>
        <Link to="/prompts" className="btn btn-outline">← Back</Link>
      </div>

      <form onSubmit={handleSubmit} className="pf-form">
        <div className="pf-layout">
          {/* Main Fields */}
          <div className="pf-main">
            <div className="card">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" className="form-input" placeholder="e.g. Custom 12-Week Workout Plan" value={form.title} onChange={set('title')} required />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input type="text" className="form-input" placeholder="Brief description of what this prompt does" value={form.description} onChange={set('description')} />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Prompt Content *
                  <span className="char-count">{charCount} / 10000</span>
                </label>
                <textarea
                  className="form-input prompt-textarea"
                  placeholder="Write your prompt here. Use [BRACKETS] for user-fillable variables like [YOUR NAME], [TOPIC], etc."
                  value={form.content}
                  onChange={set('content')}
                  required
                  rows={14}
                  maxLength={10000}
                />
                <div className="prompt-hint">
                  💡 Tip: Use [BRACKETS] for parts the user needs to fill in, e.g. [YOUR GOAL], [SUBJECT], [NUMBER OF WEEKS]
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags <span style={{ color: 'var(--text-muted)' }}>(comma separated)</span></label>
                <input type="text" className="form-input" placeholder="fitness, workout, hiit, beginner" value={form.tags} onChange={set('tags')} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="pf-sidebar">
            <div className="card pf-meta-card">
              <h3>Settings</h3>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" value={form.category} onChange={set('category')} required>
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select className="form-input" value={form.difficulty} onChange={set('difficulty')}>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Best AI Model</label>
                <select className="form-input" value={form.aiModel} onChange={set('aiModel')}>
                  {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Author</label>
                <input type="text" className="form-input" value={form.author} onChange={set('author')} />
              </div>

              <div className="form-group">
                <label className="form-label">Result Image <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                <div className="image-upload-section">
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                        {imageFile ? 'New image selected' : 'Current image'}
                      </p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="btn btn-outline" style={{ cursor: 'pointer', display: 'block', textAlign: 'center', marginBottom: '8px' }}>
                    📷 Choose Image
                  </label>
                  {imageFile && (
                    <button 
                      type="button"
                      className="btn btn-primary"
                      onClick={uploadImage}
                      disabled={uploadingImage}
                      style={{ width: '100%' }}
                    >
                      {uploadingImage ? 'Uploading...' : '⬆ Upload Image'}
                    </button>
                  )}
                </div>
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Active</div>
                  <div className="toggle-sub">Visible on website</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Featured</div>
                  <div className="toggle-sub">Show in featured section</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary pf-save-btn" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? '✓ Update Prompt' : '+ Create Prompt'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
