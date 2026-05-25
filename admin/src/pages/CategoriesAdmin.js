import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './CategoriesAdmin.css';

const EMPTY = { name: '', description: '', icon: '✨', color: '#7c3aed', order: 0 };
const ICON_PRESETS = ['📚','💻','💪','🏥','📈','✍️','⚡','🌍','🎨','💰','🍳','🎯','🔬','🎵','📱','🏠','✈️','🐾','📸','🎮'];

export default function CategoriesAdmin() {
  const { api } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories-full'],
    queryFn: () => api.get('/admin/categories').then(r => r.data.categories)
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon, color: cat.color, order: cat.order || 0 });
    setEditId(cat._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/categories', form);
        toast.success('Category created');
      }
      queryClient.invalidateQueries(['admin-categories-full']);
      queryClient.invalidateQueries(['categories']);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      queryClient.invalidateQueries(['admin-categories-full']);
      setDeleteId(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await api.put(`/categories/${id}`, { isActive: !current });
      toast.success(current ? 'Category hidden' : 'Category shown');
      queryClient.invalidateQueries(['admin-categories-full']);
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="categories-admin">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-sub">{categories.length} categories total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Category</button>
      </div>

      {isLoading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="cat-grid">
          {categories.map(cat => (
            <div key={cat._id} className="cat-admin-card" style={{ '--cc': cat.color }}>
              <div className="cac-left">
                <div className="cac-icon">{cat.icon}</div>
                <div>
                  <div className="cac-name">{cat.name}</div>
                  <div className="cac-desc">{cat.description || 'No description'}</div>
                  <div className="cac-meta">
                    <span>{cat.promptCount || 0} prompts</span>
                    <span className={`badge ${cat.isActive ? 'badge-green' : 'badge-red'}`}>{cat.isActive ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
              </div>
              <div className="cac-actions">
                <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.75rem' }} onClick={() => openEdit(cat)}>Edit</button>
                <button
                  className={`btn ${cat.isActive ? 'btn-outline' : 'btn-success'}`}
                  style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                  onClick={() => handleToggle(cat._id, cat.isActive)}
                >
                  {cat.isActive ? 'Hide' : 'Show'}
                </button>
                <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.75rem' }} onClick={() => setDeleteId(cat._id)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card cat-form-modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input type="text" className="form-input" value={form.name} onChange={set('name')} placeholder="e.g. Physical Fitness" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={form.description} onChange={set('description')} placeholder="Short description" />
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div className="icon-presets">
                  {ICON_PRESETS.map(ic => (
                    <button key={ic} type="button" className={`icon-preset ${form.icon === ic ? 'selected' : ''}`} onClick={() => setForm(p => ({ ...p, icon: ic }))}>{ic}</button>
                  ))}
                </div>
                <input type="text" className="form-input" value={form.icon} onChange={set('icon')} placeholder="Or type emoji" style={{ marginTop: 8 }} />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.color} onChange={set('color')} style={{ width: 40, height: 36, border: '1px solid var(--border)', borderRadius: 6, background: 'none', cursor: 'pointer' }} />
                    <input type="text" className="form-input" value={form.color} onChange={set('color')} />
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Order</label>
                  <input type="number" className="form-input" value={form.order} onChange={set('order')} min="0" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Delete Category?</h3>
            <p>All prompts in this category will lose their category link.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
